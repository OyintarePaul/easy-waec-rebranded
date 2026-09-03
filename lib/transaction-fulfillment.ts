import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyPayment } from "@/lib/monnify";
import { sendPurchaseReceiptEmail } from "@/lib/email";
import { vendWaecPins, generateVtpassRequestId, VtpassCard } from "@/lib/vtpass";

export interface ProcessTransactionResult {
  status: "SUCCESS" | "ALREADY_PROCESSED" | "FAILED" | "PIN_DISPATCH_FAILED";
  transactionId?: string;
  error?: string;
}

export async function processTransaction(
  paymentReference: string
): Promise<ProcessTransactionResult> {
  let transactionId: string | undefined;

  try {
    // 1. Atomic lock: allow both PENDING and PIN_DISPATCH_FAILED states to be retried
    const { data: updatedRows, error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({
        status: "PROCESSING",
        updated_at: new Date().toISOString()
      })
      .eq("reference", paymentReference)
      .in("status", ["PENDING", "PIN_DISPATCH_FAILED"])
      .select("*");

    if (updateError) {
      throw new Error(`Atomic lock query failed: ${updateError.message}`);
    }

    // 2. Handle cases where 0 rows were updated (already in-flight or completed)
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
        console.log("Already being processed...")
        return { status: "ALREADY_PROCESSED", transactionId: existingTx.id };

      }
      return { status: "FAILED", error: `Transaction is in non-retryable status: ${existingTx.status}` };
    }

    const transaction = updatedRows[0];
    transactionId = transaction.id;

    // 3. Call Monnify API to verify customer payment
    const paymentVerification = await verifyPayment(paymentReference);

    if (paymentVerification.status !== "PAID" || paymentVerification.amountPaid < transaction.amount) {
      await supabaseAdmin
        .from("transactions")
        .update({
          status: "FAILED",
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      return { status: "FAILED", transactionId, error: "Payment failed or amount mismatch." };
    }

    // 4. Vend or retrieve real PINs from VTPass using the pre-stored vendor_request_id
    const pinQuantity = transaction.quantity || 1;
    const encryptionKey = process.env.PIN_ENCRYPTION_KEY;

    if (!encryptionKey) {
      throw new Error("Missing PIN_ENCRYPTION_KEY in environment variables.");
    }

    let vtpassRequestId = transaction.vendor_request_id;
    if (!vtpassRequestId) {
      vtpassRequestId = generateVtpassRequestId();
      await supabaseAdmin
        .from("transactions")
        .update({ vendor_request_id: vtpassRequestId })
        .eq("id", transactionId);
    }

    // VTPass handles idempotency via requestId: if already bought, it safely returns existing cards
    const realPins: VtpassCard[] = await vendWaecPins({
      quantity: pinQuantity,
      customerEmail: transaction.customer_email,
      requestId: vtpassRequestId,
    });

    console.log("Pins:", realPins);
    console.log("Quantity:", pinQuantity);

    // 5. Encrypt & Save PINs to database using Supabase RPC function
    for (const item of realPins) {
      const { error: rpcError } = await supabaseAdmin.rpc("insert_encrypted_pin", {
        p_transaction_id: transactionId,
        p_raw_serial: item.serialNumber,
        p_raw_pin: item.pinCode,
        p_secret_key: encryptionKey,
        p_user_id: transaction.user_id,
      });

      if (rpcError) {
        // Ignore duplicate inserts if retrying a partially completed transaction
        if (!rpcError.message.includes("duplicate key") && !rpcError.message.includes("already exists")) {
          throw new Error(`RPC insert_encrypted_pin failed: ${rpcError.message}`);
        }
      }
    }

    // 6. Update transaction status to SUCCESS
    const { error: successUpdateError } = await supabaseAdmin
      .from("transactions")
      .update({
        status: "SUCCESS",
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    if (successUpdateError) {
      throw new Error(`Failed to update transaction status to SUCCESS: ${successUpdateError.message}`);
    }

    // 7. Trigger purchase receipt email asynchronously
    try {
      await sendPurchaseReceiptEmail({
        email: transaction.customer_email,
        paymentReference,
        quantity: pinQuantity,
        amount: transaction.amount,
        pins: realPins,
      });
    } catch (emailError) {
      console.error(`Failed to send receipt email for transaction ${transactionId}:`, emailError);
    }

    return { status: "SUCCESS", transactionId };
  } catch (error: any) {
    console.error(`Transaction fulfillment error [${paymentReference}]:`, error);

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