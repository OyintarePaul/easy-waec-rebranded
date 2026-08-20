import { Suspense } from "react";
import { getAuthUser } from "@/data/auth";
import { BuyPinDialog } from "./buy-pin-dialog";
import { PinPurchaseForm } from "@/components/purchase/pin-purchase-form";
import { DashboardMetrics, MetricsSkeleton } from "@/components/dashboard/dashboard-metrics";
import { DashboardTransactions, TransactionsSkeleton } from "@/components/dashboard/dashboard-transactions";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const userInfo = await getAuthUser();
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page) || 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {userInfo?.email || "Valued Customer"}. Manage your purchased PINs and transaction history.
          </p>
        </div>
        <BuyPinDialog>
          <PinPurchaseForm />
        </BuyPinDialog>
      </div>

      {/* Stream Summary Metric Cards */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Stream Transactions Table */}
      <Suspense key={currentPage} fallback={<TransactionsSkeleton />}>
        <DashboardTransactions currentPage={currentPage} />
      </Suspense>
    </div>
  );
}