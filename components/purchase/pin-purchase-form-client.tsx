"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { initiatePinPurchase } from "@/actions/purchase";

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
    <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Buy WAEC Result Checker PIN
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Instant digital delivery to your dashboard & email.
        </p>
      </div>

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
              <span className="font-semibold text-gray-800 dark:text-gray-200">Account:</span>{" "}
              {user.email}
            </div>
            {user.phone && (
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Phone:</span>{" "}
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
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Delivery Email
          </label>
          <input
            id="customerEmail"
            type="email"
            required
            disabled={isPending}
            placeholder="e.g. recipient@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
          />
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            PINs and purchase receipts will be dispatched to this address.
          </p>
        </div>

        {/* Quantity Select Counter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={quantity <= 1 || isPending}
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              -
            </button>
            <span className="w-12 text-center text-lg font-bold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= 10 || isPending}
              onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              +
            </button>
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
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-emerald-600 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {isPending ? "Initializing Checkout..." : `Pay ₦${totalAmount.toLocaleString()}`}
        </button>
      </form>

      {/* Auth Modal Guard Dialog */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Authentication Required
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Please sign in or create an EasyWAEC account to complete your purchase and access your PINs.
            </p>
            <div className="mt-6 flex flex-col space-y-2">
              <Link
                href="/auth/login"
                className="w-full rounded-md bg-emerald-600 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="w-full rounded-md border border-gray-300 bg-white py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                Sign Up
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}