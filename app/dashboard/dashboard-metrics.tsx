import { getUserMetrics } from "@/data/dashboard";
import { BuyPinDialog } from "@/app/dashboard/buy-pin-dialog";
import { PinPurchaseForm, PinPurchaseFormSkeleton } from "@/components/purchase/pin-purchase-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export async function DashboardMetrics() {
  const { totalSpent, totalPinsPurchased, successfulOrders, hasTransactions } =
    await getUserMetrics();

  return (
    <>
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

      {/* Empty State CTA Banner */}
      {!hasTransactions && (
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
            <Suspense fallback={<PinPurchaseFormSkeleton />}>
              <PinPurchaseForm />
            </Suspense>
          </BuyPinDialog>
        </div>
      )}
    </>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}