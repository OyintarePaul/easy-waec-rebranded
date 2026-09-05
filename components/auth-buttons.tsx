import Link from 'next/link'
import { logoutUser } from '@/actions/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthUser } from '@/data/auth'
import { Button } from '@/components/ui/button'

export async function AuthButtons() {
    const user = await getAuthUser();

    return (
        <div className="flex items-center space-x-3">
            {user ? (
                <div className="flex items-center space-x-3">
                    <Button
                        asChild
                        variant="outline"
                        className="h-auto border-none rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                    >
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </Button>
                    <form action={logoutUser}>
                        <Button
                            type="submit"
                            variant="outline"
                            className="h-auto rounded-lg border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Sign Out
                        </Button>
                    </form>
                </div>
            ) : (
                <>
                    <Button
                        asChild
                        variant="link"
                        className="h-auto p-0 text-xs font-semibold text-gray-700 hover:text-emerald-600 hover:no-underline dark:text-gray-300 dark:hover:text-emerald-400"
                    >
                        <Link href="/auth/login">
                            Login
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="h-auto rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        <Link href="/auth/sign-up">
                            Get Started
                        </Link>
                    </Button>
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
