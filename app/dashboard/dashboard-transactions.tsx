import { getUserTransactions } from "@/data/dashboard";
import { PinDetailsDialog } from "@/app/dashboard/pin-details-dialog";
import { RequeryButton } from "@/app/dashboard/requery-button";
import { DashboardPaginationClient } from "./dashboard-pagination-client";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionsProps {
    searchParamsPromise: Promise<{ page?: string }>;
}

export async function DashboardTransactions({ searchParamsPromise }: TransactionsProps) {
    const params = await searchParamsPromise;
    const currentPage = Math.max(1, Number(params?.page) || 1);
    const { transactions, totalCount, totalPages } = await getUserTransactions({
        page: currentPage,
        pageSize: 10,
    });

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

    const startRange = totalCount === 0 ? 0 : (currentPage - 1) * 10 + 1;
    const endRange = Math.min(currentPage * 10, totalCount);

    return (
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

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Showing <span className="font-medium text-gray-900 dark:text-white">{startRange}</span> to{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{endRange}</span> of{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{totalCount}</span> transactions
                    </p>

                    <DashboardPaginationClient currentPage={currentPage} totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}

export function TransactionsSkeleton() {
    return <Skeleton className="h-[420px] w-full rounded-xl" />;
}