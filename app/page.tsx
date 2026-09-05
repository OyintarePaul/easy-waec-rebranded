import { PinPurchaseForm, PinPurchaseFormSkeleton } from "@/components/purchase/pin-purchase-form";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

export default async function HomePage() {

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Badge
          variant="outline"
          className="inline-block rounded-full border-none bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
        >
          ⚡ 100% Instant Automated Delivery
        </Badge>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Buy WAEC Result Checker PINs Online
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Get official WAEC scratch cards delivered straight to your email and dashboard within seconds. Guaranteed valid PINs & Serials.
        </p>

        {/* Embedded Purchase Form */}
        <div className="mt-8">
          <Suspense fallback={<PinPurchaseFormSkeleton />}>
            <PinPurchaseForm />
          </Suspense>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-12 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                1
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                Select Quantity
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose the number of WAEC scratch card PINs you need for your result verification.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                2
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                Make Payment
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Pay securely via bank transfer or debit card through our encrypted Monnify gateway.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                3
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                Receive PINs
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Your PIN and Serial Number are dispatched instantly to your email and stored safely in your user dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-4">
          <details className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
              How long does it take to receive my PIN?
            </summary>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              PIN generation and dispatch is 100% automated. You will receive your PIN on the screen, in your email, and on your dashboard immediately after payment confirmation.
            </p>
          </details>

          <details className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
              Can I use one PIN for multiple result checks?
            </summary>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              A single WAEC result checker PIN can be used up to 5 times for a single candidate exam number.
            </p>
          </details>

          <details className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
              What if I didn't receive my email receipt?
            </summary>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              You can log into your EasyWAEC account at any time and view all your purchased PINs on your User Dashboard.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}