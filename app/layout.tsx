import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyWAEC - Instant WAEC Scratch Card & PIN Purchase",
  description: "Buy WAEC result checker PINs with instant digital delivery.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userSession = user
    ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
      }
    : null;

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white dark:bg-gray-950 dark:text-white`}>
        <Navbar user={userSession} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}