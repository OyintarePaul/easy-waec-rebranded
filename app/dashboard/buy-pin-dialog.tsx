"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PinPurchaseForm } from "@/components/purchase/pin-purchase-form";

interface UserInfo {
  id: string;
  email: string;
  phone?: string;
}

interface BuyPinDialogProps {
  user: UserInfo
}

export function BuyPinDialog({ user }: BuyPinDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Buy WAEC PIN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Purchase WAEC Result Checkers
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <PinPurchaseForm user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
}