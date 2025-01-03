'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkflowsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/workflows/overview')
  }, [router])

  return null
}

