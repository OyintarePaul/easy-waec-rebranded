"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpUser } from "@/actions/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpUser, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md space-y-6 border-none p-2 shadow-md dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an EasyWAEC Account
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get instant access to WAEC Scratch Cards and PINs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1 text-xs text-red-500">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="08012345678"
                className="focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              {state?.fieldErrors?.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {state.fieldErrors.phone[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-xs text-red-500">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500 focus-visible:ring-emerald-500 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="ml-1 font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
