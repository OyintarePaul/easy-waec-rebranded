"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getDecryptedPinsForTransaction } from "@/actions/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DecryptedPin } from "@/lib/supabase";

interface PinDetailsDialogProps {
  transactionId: string;
  reference: string;
}

export function PinDetailsDialog({ transactionId, reference }: PinDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState<DecryptedPin[]>([]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLoading(true);
      try {
        const data = await getDecryptedPinsForTransaction(transactionId);
        setPins(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load PINs");
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 text-xs font-medium"
        >
          View PINs
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
            PIN Details (Ref: {reference})
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 max-h-96 space-y-3 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Decrypting PINs...</div>
          ) : pins.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No PINs found for this transaction.
            </div>
          ) : (
            pins.map((pin, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Card #{idx + 1}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block font-medium text-gray-400">SERIAL NUMBER</span>
                    <div className="mt-1 flex items-center justify-between rounded bg-white px-2 py-1 font-mono text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white">
                      <span className="truncate">{pin.decrypted_serial}</span>
                      <button
                        onClick={() => copyToClipboard(pin.decrypted_serial, "Serial Number")}
                        className="ml-1 text-[10px] text-emerald-600 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-400">PIN CODE</span>
                    <div className="mt-1 flex items-center justify-between rounded bg-white px-2 py-1 font-mono text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white">
                      <span className="truncate">{pin.decrypted_pin}</span>
                      <button
                        onClick={() => copyToClipboard(pin.decrypted_pin, "PIN")}
                        className="ml-1 text-[10px] text-emerald-600 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}