import { verifyPayment } from "./monnify";
import { sendPurchaseReceiptEmail } from "./email";
import { supabaseAdmin } from "@/lib/supabase/admin"

interface ProcessTransactionResult {
  status: "SUCCESS" | "ALREADY_PROCESSED" | "FAILED" | "PIN_DISPATCH_FAILED";
  transactionId?: string;
  error?: string;
}

/**
 * Placeholder / simulated function to fetch raw WAEC PINs and Serials from supplier API.
 */
async function fetchSupplierPins(quantity: number) {
  const pins: Array<{ serialNumber: string; pinCode: string }> = [];

  for (let i = 0; i < quantity; i++) {
    const randomSerial = "WRN" + Math.floor(100000000 + Math.random() * 900000000);
    const randomPin = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    pins.push({ serialNumber: randomSerial, pinCode: randomPin });
  }

  return pins;
}

/**
 * Processes payment verification and delivers encrypted PINs for a given payment reference.
 */
export async function processTransaction(
  paymentReference: string
): Promise<ProcessTransactionResult> {
  let transactionId: string | undefined;

  try {
    // 1. Execute an atomic lock query on Supabase transactions
    const { data: updatedRows, error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({ status: "PROCESSING" })
      .eq("reference", paymentReference)
      .eq("status", "PENDING")
      .select("*");

    if (updateError) {
      throw new Error(`Atomic lock query failed: ${updateError.message}`);
    }

    // 2. Handle cases where 0 rows were updated (already processed, in-flight, or not found)
    if (!updatedRows || updatedRows.length === 0) {
      const { data: existingTx, error: fetchError } = await supabaseAdmin
        .from("transactions")
        .select("id, status")
        .eq("reference", paymentReference)
        .single();

      if (fetchError || !existingTx) {
        throw new Error(`Transaction with reference ${paymentReference} not found.`);
      }

      if (existingTx.status === "SUCCESS" || existingTx.status === "PROCESSING") {
        return { status: "ALREADY_PROCESSED", transactionId: existingTx.id };
      }

      return { status: "FAILED", error: `Transaction is in status: ${existingTx.status}` };
    }

    const transaction = updatedRows[0];
    transactionId = transaction.id;

    // 3. Call Monnify API to verify payment
    const paymentVerification = await verifyPayment(paymentReference);

    if (paymentVerification.status !== "PAID" || paymentVerification.amountPaid < transaction.amount) {
      await supabaseAdmin
        .from("transactions")
        .update({ status: "FAILED" })
        .eq("id", transactionId);

      return { status: "FAILED", transactionId };
    }

    // 4. If PAID: Fulfill PIN purchase
    const pinQuantity = transaction.quantity || 1;
    const encryptionKey = process.env.PIN_ENCRYPTION_KEY;

    if (!encryptionKey) {
      throw new Error("Missing PIN_ENCRYPTION_KEY in environment variables.");
    }

    // Fetch raw PINs from simulated supplier API
    const rawPins = await fetchSupplierPins(pinQuantity);

    // Invoke RPC insert_encrypted_pin via supabaseAdmin for each bought PIN
    for (const item of rawPins) {
      const { error: rpcError } = await supabaseAdmin.rpc("insert_encrypted_pin", {
        p_transaction_id: transactionId,
        p_raw_serial: item.serialNumber,
        p_raw_pin: item.pinCode,
        p_secret_key: encryptionKey,
        p_user_id: transaction.user_id,
      });

      if (rpcError) {
        throw new Error(`RPC insert_encrypted_pin failed: ${rpcError.message}`);
      }
    }

    // Update transaction status to SUCCESS
    const { error: successUpdateError } = await supabaseAdmin
      .from("transactions")
      .update({ status: "SUCCESS" })
      .eq("id", transactionId);

    if (successUpdateError) {
      throw new Error(`Failed to update transaction status to SUCCESS: ${successUpdateError.message}`);
    }

    // Trigger purchase receipt email sending asynchronously
    try {
      await sendPurchaseReceiptEmail({
        email: transaction.customer_email,
        paymentReference,
        quantity: pinQuantity,
        amount: transaction.amount,
        pins: rawPins,
      });
    } catch (emailError) {
      console.error(`Failed to send receipt email for transaction ${transactionId}:`, emailError);
      // Non-blocking error for email delivery failure
    }

    return { status: "SUCCESS", transactionId };
  } catch (error: any) {
    console.error(`Transaction fulfillment error [${paymentReference}]:`, error);

    // On failure, update transaction status to PIN_DISPATCH_FAILED if transaction record exists
    if (transactionId) {
      await supabaseAdmin
        .from("transactions")
        .update({
          status: "PIN_DISPATCH_FAILED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId);
    }

    return {
      status: "PIN_DISPATCH_FAILED",
      transactionId,
      error: error.message || "An unexpected error occurred during transaction processing.",
    };
  }
}