'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

const routes = [
  {
    href: '/tasks-goals',
    label: 'Tasks & Goals',
  },
  {
    href: '/journal',
    label: 'Journal',
  },
  {
    href: '/community',
    label: 'Community',
  },
  {
    href: '/mental-health',
    label: 'Mental Health',
  },
  {
    href: '/finances',
    label: 'Finances',
  },
  {
    href: '/projects',
    label: 'Projects',
  },
  {
    href: '/habits',
    label: 'Habits',
  },
  {
    href: '/workflows',
    label: 'Workflows',
  },
  {
    href: '/insights',
    label: 'Insights',
  },
  {
    href: '/settings',
    label: 'Settings',
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Productivity App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 