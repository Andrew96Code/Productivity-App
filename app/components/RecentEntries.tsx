'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type JournalEntry = {
  id: string
  date: string
  title: string
}

export function RecentEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])

  useEffect(() => {
    // In a real app, fetch this data from your backend or local storage
    const dummyEntries: JournalEntry[] = [
      { id: '1', date: '2023-07-01', title: 'Productive day at work' },
      { id: '2', date: '2023-06-30', title: 'Reflections on personal growth' },
      { id: '3', date: '2023-06-29', title: 'Overcoming challenges' },
    ]
    setEntries(dummyEntries)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex justify-between items-center">
              <span>{entry.date}: {entry.title}</span>
              <Button variant="ghost" size="sm">View</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

