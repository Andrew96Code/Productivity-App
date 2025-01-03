import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Suspense } from 'react'
import Loading from './loading'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Productivity App',
  description: 'A comprehensive productivity and task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Navigation />
          <Suspense fallback={<Loading />}>
            <main className="min-h-screen pt-4">
              {children}
            </main>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}

