"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

// Extend standard Next.js Link props to pass through onClick, target, etc.
interface NavLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary-foreground",
        isActive
          ? "text-primary dark:text-primary-foreground font-semibold"
          : "text-muted-foreground",
        className
      )}
      {...props} // Spreads onClick and any other native anchor attributes safely
    >
      {children}
    </Link>
  );
}
