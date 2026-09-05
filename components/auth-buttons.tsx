import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutUser } from '@/actions/auth'
import { Skeleton } from '@/components/ui/skeleton'

export async function AuthButtons() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()


    return (
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
    )
}

export function AuthButtonsSkeleton() {
    return (
        <div className="flex items-center space-x-3">
            {/* Matches the 'Login' or 'Dashboard' width dimensions */}
            <Skeleton className="h-8 w-14 rounded-lg" />
            {/* Matches the 'Get Started' or 'Sign Out' width dimensions */}
            <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
    )
}
