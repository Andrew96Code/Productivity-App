'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <div className="mt-4 space-x-4">
        <button
          onClick={reset}
          className="text-blue-500 hover:underline"
        >
          Try again
        </button>
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  )
} 