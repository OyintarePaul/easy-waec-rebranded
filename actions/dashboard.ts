"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getUserTransactions() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return transactions || [];
}

export async function getDecryptedPinsForTransaction(transactionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Verify user ownership of transaction
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .select("id")
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .single();

  if (txError || !transaction) {
    throw new Error("Transaction not found or unauthorized access.");
  }

  const secretKey = process.env.PIN_ENCRYPTION_KEY;
  if (!secretKey) {
    throw new Error("Server configuration error: Encryption key missing.");
  }

  // 2. Call secure admin RPC to decrypt PINs
  const { data: pins, error: rpcError } = await supabaseAdmin.rpc("get_decrypted_pins", {
    p_transaction_id: transactionId,
    p_secret_key: secretKey,
  });

  if (rpcError) {
    throw new Error(`Failed to decrypt PINs: ${rpcError.message}`);
  }

  return (pins as { id: string; serial_number: string; decrypted_pin: string }[]) || [];
}