"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const resolvedParams = React.use(searchParams);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back to EasyWAEC
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to view purchases and purchase PINs
          </p>
        </div>

        {resolvedParams?.message && (
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {resolvedParams.message}
          </div>
        )}

        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            {state?.fieldErrors?.email && (
              <p className="mt-1 text-xs text-red-500">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            {state?.fieldErrors?.password && (
              <p className="mt-1 text-xs text-red-500">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}