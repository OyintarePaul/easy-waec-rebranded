import { Resend } from "resend";
import { PurchaseReceiptEmail, PinItem } from "@/emails/purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendReceiptEmailParams {
  userEmail?: string;
  email?: string; // Alias for flexible callers
  userName?: string;
  quantity: number;
  customerName?: string; // Alias for flexible callers
  transactionRef?: string;
  paymentReference?: string; // Alias for flexible callers
  totalAmount?: number;
  amount?: number; // Alias for flexible callers
  pins: PinItem[];
}

/**
 * Sends a purchase receipt email using Resend and React Email.
 */
export async function sendPurchaseReceiptEmail(params: SendReceiptEmailParams) {
  try {
    const recipientEmail = params.userEmail || params.email;
    const recipientName = params.userName || params.customerName || "Valued Customer";
    const ref = params.transactionRef || params.paymentReference || "N/A";
    const total = params.totalAmount ?? params.amount ?? 0;

    if (!recipientEmail) {
      console.warn("sendPurchaseReceiptEmail skipped: No recipient email provided.");
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("sendPurchaseReceiptEmail skipped: Missing RESEND_API_KEY.");
      return;
    }

    const { data, error } = await resend.emails.send({
      from: "EasyWAEC <orders@easywaec.com>",
      to: [recipientEmail],
      subject: `[EasyWAEC] Payment Receipt & PINs (${ref})`,
      react: PurchaseReceiptEmail({
        userName: recipientName,
        transactionRef: ref,
        totalAmount: total,
        pins: params.pins,
      }),
    });

    if (error) {
      console.error("Resend API Error sending purchase receipt:", error);
      return;
    }

    console.log(`Purchase receipt email successfully dispatched to ${recipientEmail}. ID: ${data?.id}`);
  } catch (error) {
    // Catch gracefully to ensure parent transaction pipeline is not interrupted
    console.error("Unexpected error in sendPurchaseReceiptEmail:", error);
  }
}