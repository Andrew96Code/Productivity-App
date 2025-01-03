'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function JournalStreak() {
  const [streak, setStreak] = useState(0)
  const [lastEntry, setLastEntry] = useState<Date | null>(null)

  useEffect(() => {
    // In a real app, calculate this based on actual journal entries
    setStreak(7)
    setLastEntry(new Date())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl font-bold">{streak}</p>
          <p className="text-sm text-gray-500">days in a row</p>
        </div>
        <Progress value={(streak / 30) * 100} className="mt-4" />
        <p className="text-sm text-gray-500 mt-2">
          Last entry: {lastEntry ? lastEntry.toLocaleDateString() : 'N/A'}
        </p>
      </CardContent>
    </Card>
  )
}

