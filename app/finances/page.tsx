'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FinancesPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/finances/overview')
  }, [router])

  return null
}

