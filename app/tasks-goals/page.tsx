'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TasksGoalsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/tasks-goals/tasks')
  }, [router])

  return null
} 