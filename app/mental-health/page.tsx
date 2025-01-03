'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MentalHealthPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/mental-health/overview')
  }, [router])

  return null
}

