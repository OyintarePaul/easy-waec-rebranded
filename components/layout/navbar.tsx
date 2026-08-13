"use client";

import Link from "next/link";
import { logoutUser } from "@/actions/auth";

interface UserSession {
  id: string;
  email?: string;
  name?: string;
}

interface NavbarProps {
  user: UserSession | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-500">
            EasyWAEC
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Home
          </Link>
          <Link href="/result" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Check Result
          </Link>
        </nav>

        {/* Dynamic Auth Action Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              >
                Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}