'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InsightsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/insights/performance')
  }, [router])

  return null
}

