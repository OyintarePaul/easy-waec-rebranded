"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { requeryTransaction } from "@/actions/requery";

export function RequeryButton({ reference }: { reference: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequery = async () => {
    setLoading(true);
    try {
      const res = await requeryTransaction(reference);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to re-query transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequery}
      disabled={loading}
      className="rounded bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60"
    >
      {loading ? "Verifying..." : "Requery"}
    </button>
  );
}