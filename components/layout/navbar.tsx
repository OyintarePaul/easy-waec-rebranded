import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons, AuthButtonsSkeleton } from "../auth-buttons";

export function Navbar() {
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

        <Suspense fallback={<AuthButtonsSkeleton />}>
          <AuthButtons />
        </Suspense>
      </div>
    </header>
  );
}