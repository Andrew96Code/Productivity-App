'use client'

import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard">
            <span className="text-2xl font-bold text-primary">UltimateApp</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  )
}

