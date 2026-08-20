import { getUserTransactions } from "@/data/dashboard";
import {getAuthUser} from "@/data/auth"
import { PinDetailsDialog } from "./pin-details-dialog";
import { RequeryButton } from "./requery-button";
import { BuyPinDialog } from "./buy-pin-dialog";
import { PinPurchaseForm } from "@/components/purchase/pin-purchase-form";

export default async function DashboardPage() {
  const userInfo = await getAuthUser()
  const transactions = await getUserTransactions();

  const totalSpent = transactions
    .filter((tx) => tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const successfulOrders = transactions.filter((tx) => tx.status === "SUCCESS").length;

  const totalPinsPurchased = transactions
    .filter((tx) => tx.status === "SUCCESS")
    .reduce((sum, tx) => sum + Number(tx.quantity || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950/80 dark:text-green-300">
            Successful
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300">
            Pending
          </span>
        );
      case "PIN_DISPATCH_FAILED":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            Dispatch Failed
          </span>
        );
      case "FAILED":
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950/80 dark:text-red-300">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {userInfo.email}. Manage your purchased PINs and transaction history.
          </p>
        </div>
        <BuyPinDialog >
          <PinPurchaseForm />
        </BuyPinDialog>
      </div>

      {/* Summary Metric Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            ₦{totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">PINs Purchased</p>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {totalPinsPurchased}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Successful Orders</p>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {successfulOrders}
          </p>
        </div>
      </div>

      {/* Empty State CTA Banner (Visible when no transactions exist) */}
      {transactions.length === 0 && (
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 sm:flex-row dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div>
            <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
              Ready to check your WAEC results?
            </h3>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              Get instant, encrypted result checking PINs delivered directly to your dashboard.
            </p>
          </div>
          <BuyPinDialog>
            <PinPurchaseForm />
          </BuyPinDialog>
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Reference</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">
                      {tx.reference}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{tx.quantity}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      ₦{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(tx.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {tx.status === "SUCCESS" && (
                          <PinDetailsDialog transactionId={tx.id} reference={tx.reference} />
                        )}
                        {(tx.status === "PENDING" || tx.status === "PIN_DISPATCH_FAILED") && (
                          <RequeryButton reference={tx.reference} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}