"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { initiatePinPurchase } from "@/actions/purchase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface UserInfo {
  id: string;
  email: string;
  phone?: string;
}

interface PinPurchaseFormClientProps {
  user: UserInfo | null;
  initialUnitPrice: number; // Optional prop for initial unit price
}

export function PinPurchaseFormClient({ user, initialUnitPrice }: PinPurchaseFormClientProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalAmount = quantity * initialUnitPrice;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // If user is unauthenticated, pop up the Auth Modal Guard
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    startTransition(async () => {
      try {
        const result = await initiatePinPurchase({ quantity, customerEmail });
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        } else {
          setError("Failed to retrieve checkout URL. Please try again.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };


  return (
    <Card className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-4">
      <CardHeader className="mb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Buy WAEC Result Checker PIN
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Instant digital delivery to your dashboard & email.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Status / Info */}
          {user ? (
            <div className="rounded-lg bg-gray-50 p-3.5 text-xs space-y-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <div>
                <span className="font-semibold text-muted-foreground dark:text-gray-200">Account:</span>{" "}
                {user.email}
              </div>
              {user.phone && (
                <div>
                  <span className="font-semibold text-muted-foreground dark:text-gray-200">Phone:</span>{" "}
                  {user.phone}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              You are currently not logged in. You will be prompted to sign in before checkout.
            </div>
          )}

          {/* Delivery Email Input */}
          <div className="space-y-1.5">
            <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Delivery Email
            </Label>
            <Input
              id="customerEmail"
              type="email"
              required
              disabled={isPending}
              placeholder="e.g. recipient@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full focus-visible:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              PINs and purchase receipts will be dispatched to this address.
            </p>
          </div>

          {/* Quantity Select Counter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Quantity
            </Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                disabled={quantity <= 1 || isPending}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="h-10 w-10 p-0 text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                -
              </Button>
              <span className="w-12 text-center text-lg font-bold text-gray-900 dark:text-white">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={quantity >= 10 || isPending}
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                className="h-10 w-10 p-0 text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                +
              </Button>
            </div>
          </div>

          {/* Live Price Breakdown */}
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Unit Price</span>
              <span>₦{initialUnitPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>Quantity</span>
              <span>× {quantity}</span>
            </div>
            <div className="my-2 border-t border-emerald-200 dark:border-emerald-800" />
            <div className="flex justify-between text-base font-bold text-emerald-700 dark:text-emerald-400">
              <span>Total Payable</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 py-6 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:ring-emerald-500 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {isPending ? "Initializing Checkout..." : `Pay ₦${totalAmount.toLocaleString()}`}
          </Button>
        </form>
      </CardContent>

      {/* Auth Modal Guard Dialog */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm bg-white p-2 shadow-xl dark:bg-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Authentication Required
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Please sign in or create an EasyWAEC account to complete your purchase and access your PINs.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                asChild
                className="w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full bg-white font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setIsAuthModalOpen(false)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:no-underline p-0 h-auto"
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>


  );
}