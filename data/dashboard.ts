import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "./auth";

export async function getUserMetrics() {
  const user = await getAuthUser()
  if (!user) throw new Error("Unauthorized. Please log in.")

  const supabase = await createClient();
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, quantity, status")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch transaction metrics: ${error.message}`);
  }

  const allTx = transactions || [];

  const totalSpent = allTx
    .filter((tx) => tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const successfulOrders = allTx.filter((tx) => tx.status === "SUCCESS").length;

  const totalPinsPurchased = allTx
    .filter((tx) => tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + Number(tx.quantity || 0), 0);

  return {
    totalSpent,
    successfulOrders,
    totalPinsPurchased,
    hasTransactions: allTx.length > 0,
  };
}

export async function getUserTransactions({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const user = await getAuthUser()
  if (!user) throw new Error("Unauthorized. Please log in.")

  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: transactions, count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    transactions: transactions || [],
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
  };
}