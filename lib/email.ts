import { Resend } from "resend";
import { PurchaseReceiptEmail, PinItem } from "@/emails/purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendReceiptEmailParams {  
  email: string; // Alias for flexible callers
  quantity: number;
  customerName?: string; // Alias for flexible callers
  paymentReference?: string; // Alias for flexible callers
  amount?: number; // Alias for flexible callers
  pins: PinItem[];
}

/**
 * Sends a purchase receipt email using Resend and React Email.
 */
export async function sendPurchaseReceiptEmail(params: SendReceiptEmailParams) {
  try {
    const recipientEmail = params.email;
    const recipientName = params.email?.split("@")[0] || "Customer";
    const ref = params.paymentReference || "N/A";
    const total = params.amount ?? 0;

    if (!recipientEmail) {
      console.warn("sendPurchaseReceiptEmail skipped: No recipient email provided.");
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("sendPurchaseReceiptEmail skipped: Missing RESEND_API_KEY.");
      return;
    }

    const { data, error } = await resend.emails.send({
      from: "EasyWAEC <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `[EasyWAEC] Payment Receipt & PINs (${ref})`,
      react: PurchaseReceiptEmail({
        username: recipientName,
        transactionRef: ref,
        totalAmount: total,
        pins: params.pins,
      }),
    });

    if (error) {
      console.error("Resend API Error sending purchase receipt:", error);
      return;
    }

  } catch (error) {
    // Catch gracefully to ensure parent transaction pipeline is not interrupted
    console.error("Unexpected error in sendPurchaseReceiptEmail:", error);
  }
}