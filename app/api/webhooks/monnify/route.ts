import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "@/lib/monnify";
import { processTransaction } from "@/lib/transaction-fulfillment";

export async function POST(req: NextRequest) {
  console.log("Received Monnify webhook request:", req.url);
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("monnify-signature");

    if (!signatureHeader) {
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 401 }
      );
    }

    // 1. Validate signature to ensure payload authenticity
    const isValid = validateWebhookSignature(rawBody, signatureHeader);
    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.eventType;
    const paymentReference =
      payload.eventData?.paymentReference || payload.eventData?.transactionReference;

    if (!paymentReference) {
      return NextResponse.json(
        { error: "Invalid webhook payload structure" },
        { status: 400 }
      );
    }

    // 2. Process successful transactions
    if (eventType === "SUCCESSFUL_TRANSACTION") {
      await processTransaction(paymentReference);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("Monnify Webhook Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}