import { Suspense } from "react";
import { DashboardMetrics, MetricsSkeleton } from "@/app/dashboard/dashboard-metrics";
import { DashboardTransactions, TransactionsSkeleton } from "@/app/dashboard/dashboard-transactions";
import { BuyPinDialog } from "./buy-pin-dialog";
import { PinPurchaseForm, PinPurchaseFormSkeleton } from "@/components/purchase/pin-purchase-form";
import { UserEmailPlaceholder } from "./user-email-placeholder";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function DashboardPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-6 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back,{" "}
            {/* Only this tiny string is dynamic, wrapped in an inline suspense boundary */}
            <Suspense fallback={"Valued Customer"}>
              <UserEmailPlaceholder />
            </Suspense>
            . Manage your purchased PINs and transaction history.
          </p>
        </div>

        {/* The Action Button is static and interactive instantly */}
        <BuyPinDialog>
          <Suspense fallback={<PinPurchaseFormSkeleton />}>
          <PinPurchaseForm />
          </Suspense>
        </BuyPinDialog>
      </div>

      {/* 2. Stream Metrics (Independent) */}
      <div className="mt-8">
        <Suspense fallback={<MetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>
      </div>

      {/* 3. Stream Transactions Table (Depends on searchParams Promise) */}
      <Suspense fallback={<TransactionsSkeleton />}>
        <DashboardTransactions searchParamsPromise={searchParams} />
      </Suspense>

    </div>
  );
}