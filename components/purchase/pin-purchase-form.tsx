import { getWaecUnitPrice } from "@/lib/vtpass";
import { PinPurchaseFormClient } from "./pin-purchase-form-client";
import { getAuthUser } from "@/data/auth";
import { Skeleton } from "@/components/ui/skeleton";

export async function PinPurchaseForm() {
  const [user, unitPrice] = await Promise.all([
    getAuthUser(),
    getWaecUnitPrice()
  ]);

  return <PinPurchaseFormClient initialUnitPrice={unitPrice} user={user} />;
}

export function PinPurchaseFormSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-xl border p-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full bg-emerald-100/50 dark:bg-emerald-950/30" />
    </div>
  );
}