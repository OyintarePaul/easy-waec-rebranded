import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons, AuthButtonsSkeleton } from "../auth-buttons";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Check Result", href: "/result" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Area: Mobile Menu + Brand Logo */}
        <div className="flex items-center space-x-2">
          <MobileMenu links={NAV_LINKS} />
          
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-primary dark:text-primary-foreground">
              EasyWAEC
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Area: Authentication Context */}
        <Suspense fallback={<AuthButtonsSkeleton />}>
          <AuthButtons />
        </Suspense>
      </div>
    </header>
  );
}
