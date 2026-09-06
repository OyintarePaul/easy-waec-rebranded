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
                        size="sm"
                        className="bg-primary/10 text-primary"
                    >
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </Button>
                    <form action={logoutUser}>
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
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
                        className="h-auto p-0 text-xs font-semibold text-gray-700 hover:text-primary hover:no-underline dark:text-gray-300 dark:hover:text-primary-foreground"
                    >
                        <Link href="/auth/login">
                            Login
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="sm"
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
