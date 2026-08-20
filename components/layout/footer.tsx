import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-500">
              EasyWAEC
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automated scratch card PIN purchase platform. Direct delivery straight to your email and dashboard.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Buy WAEC PIN
                </Link>
              </li>
              <li>
                <Link href="/result" className="hover:text-emerald-600">
                  Check Result
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Support
            </h4>
            <p className="mt-3 text-xs">
              Email:{" "}
              <a href="mailto:support@easywaec.com" className="text-emerald-600 hover:underline">
                support@easywaec.com
              </a>
            </p>
            <p className="mt-1 text-xs text-gray-500">Available 24/7 for automated PIN dispatch</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Secured Payments
            </h4>
            <div className="mt-3 flex items-center space-x-2">
              <span className="rounded bg-gray-200 px-2 py-1 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Monnify
              </span>
              <span className="rounded bg-gray-200 px-2 py-1 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Cards / Transfer
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800">
          © {new Date().getFullYear()} EasyWAEC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


