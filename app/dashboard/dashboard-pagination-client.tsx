"use client";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DashboardPaginationClientProps {
  currentPage: number;
  totalPages: number;
}

export function DashboardPaginationClient({ currentPage, totalPages }: DashboardPaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());

    // 🚀 Intercept route changes to keep updates scoped strictly to this dynamic container
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1 && !isPending) handlePageChange(currentPage - 1);
            }}
            aria-disabled={currentPage <= 1 || isPending}
            className={`${
              currentPage <= 1 || isPending
                ? "pointer-events-none opacity-50"
                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
            } cursor-pointer`}
          />
        </PaginationItem>

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages && !isPending) handlePageChange(currentPage + 1);
            }}
            aria-disabled={currentPage >= totalPages || isPending}
            className={`${
              currentPage >= totalPages || isPending
                ? "pointer-events-none opacity-50"
                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
            } cursor-pointer`}
          />
        </PaginationItem>
        
      </PaginationContent>
    </Pagination>
  );
}