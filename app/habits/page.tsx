'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HabitsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/habits/overview')
  }, [router])

  return null
}

