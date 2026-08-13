import { NextRequest, NextResponse } from "next/server";
import { processTransaction } from "@/lib/transaction-fulfillment";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentReference =
    searchParams.get("paymentReference")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!paymentReference) {
    return NextResponse.redirect(`${baseUrl}/dashboard?status=failed`);
  }

  try {
    const result = await processTransaction(paymentReference);

    if (result.status === "SUCCESS" || result.status === "ALREADY_PROCESSED") {
      return NextResponse.redirect(`${baseUrl}/dashboard?status=success`);
    }

    return NextResponse.redirect(`${baseUrl}/dashboard?status=failed`);
  } catch (error) {
    console.error("Payment Verification Redirect Error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?status=failed`);
  }
}