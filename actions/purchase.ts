"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { initiatePayment } from "@/lib/monnify";
import { generateVtpassRequestId, getWaecUnitPrice } from "@/lib/vtpass";

const purchaseSchema = z.object({
  quantity: z
    .number()
    .min(1, { message: "Minimum quantity is 1" })
    .max(10, { message: "Maximum quantity per transaction is 10" }),
  customerEmail: z.email("Please enter a valid email address"),
});

export async function initiatePinPurchase({
  quantity,
  customerEmail,
}: {
  quantity: number;
  customerEmail: string;
}) {
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please log in to complete your purchase.");
  }

  // 1. Validate inputs
  const validated = purchaseSchema.safeParse({ quantity, customerEmail });
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message || "Invalid input";
    throw new Error(errorMsg);
  }

  const validQuantity = validated.data.quantity;
  const targetEmail = validated.data.customerEmail;

  // 2. Fetch live price dynamically (cached for 1 hour via 'use cache')
  const unitPrice = await getWaecUnitPrice();
  const totalAmount = unitPrice * validQuantity;

  // 3. Generate unique payment reference & vendor request ID
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const paymentReference = `EASYWAEC-TX-${Date.now()}-${randomStr}`;
  const vendorRequestId = generateVtpassRequestId();

  // 4. Insert PENDING transaction record with pre-generated vendor_request_id
  const { error: dbError } = await supabaseAdmin.from("transactions").insert({
    user_id: user.id,
    customer_email: targetEmail,
    reference: paymentReference,
    vendor_request_id: vendorRequestId,
    amount: totalAmount,
    quantity: validQuantity,
    status: "PENDING",
  });

  if (dbError) {
    console.error("Database Transaction Insert Error:", dbError);
    throw new Error("Failed to initialize transaction record.");
  }

  // 5. Initiate Monnify payment checkout
  const paymentResponse = await initiatePayment({
    amount: totalAmount,
    customerName: user.email?.split("@")[0] || "Customer",
    customerEmail: targetEmail,
    paymentReference,
    paymentDescription: `Purchase of ${validQuantity} WAEC Result Checker PIN(s)`,
  });

  return { checkoutUrl: paymentResponse.checkoutUrl };
}