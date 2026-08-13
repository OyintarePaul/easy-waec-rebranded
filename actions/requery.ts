"use server";

import { createClient } from "@/lib/supabase/server";
import { processTransaction } from "@/lib/transaction-fulfillment";

export async function requeryTransaction(reference: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    // Verify transaction belongs to authenticating user
    const { data: tx, error: txError } = await supabase
      .from("transactions")
      .select("id, reference")
      .eq("reference", reference)
      .eq("user_id", user.id)
      .single();

    if (txError || !tx) {
      return { success: false, message: "Transaction reference not found." };
    }

    // Force re-verify transaction and issue missing PINs
    const result = await processTransaction(reference);

    if (result.status === "SUCCESS") {
      return {
        success: true,
        message: "Transaction successfully updated and PINs delivered!",
      };
    } else {
      return {
        success: false,
        message: "Payment verification pending or failed.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "An error occurred during re-query.",
    };
  }
}