'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type JournalEntry = {
  date: string
  mood: number
  energy: number
}

export function MoodEnergyChart() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [timeRange, setTimeRange] = useState('7')

  useEffect(() => {
    const allEntries: JournalEntry[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('journal-')) {
        const entry = JSON.parse(localStorage.getItem(key) || '{}')
        allEntries.push({
          date: entry.date,
          mood: entry.mood,
          energy: entry.energy
        })
      }
    }
    allEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setEntries(allEntries)
  }, [])

  const filteredEntries = entries.slice(-parseInt(timeRange))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mood and Energy Levels Over Time</CardTitle>
        <CardDescription>Visualize your mood and energy patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredEntries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood" />
            <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

