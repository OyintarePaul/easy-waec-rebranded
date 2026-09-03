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
    await processTransaction(paymentReference);
    
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error("Payment Verification Redirect Error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?status=failed`);
  }
}