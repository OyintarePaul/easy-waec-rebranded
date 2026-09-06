"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NavLink } from "./nav-link";
import Link from "next/link";

interface LinkItem {
    label: string;
    href: string;
}

interface MobileMenuProps {
    links: LinkItem[];
}

export function MobileMenu({ links }: MobileMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] pt-12">
                <div className="px-4 border-b border-muted pb-4">
                    <SheetClose asChild>
                        <Link href="/" className="inline-block">
                            <SheetTitle className="text-2xl font-black tracking-tight text-primary dark:text-primary-foreground text-left">
                                EasyWAEC
                            </SheetTitle>
                        </Link>
                    </SheetClose>
                </div>
                <nav className="flex flex-col space-y-4">
                    {links.map((link) => (
                        <SheetClose key={link.href} asChild>
                            <NavLink
                                href={link.href}
                                className="text-base px-4 py-2 block border-b border-muted"
                            >
                                {link.label}
                            </NavLink>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
