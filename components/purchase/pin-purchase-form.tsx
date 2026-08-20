import { getWaecUnitPrice } from "@/lib/vtpass";
import { PinPurchaseFormClient } from "./pin-purchase-form-client";
import { getAuthUser } from "@/data/auth";

export async function PinPurchaseForm() {
  const user = await getAuthUser();
  const unitPrice = await getWaecUnitPrice();

  return <PinPurchaseFormClient initialUnitPrice={unitPrice} user={user} />;
}