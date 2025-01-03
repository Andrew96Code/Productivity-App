'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type MoodData = {
  date: string
  mood: number
}

export function MoodAnalysis() {
  const [moodData, setMoodData] = useState<MoodData[]>([])

  useEffect(() => {
    // In a real app, fetch this data from your backend or local storage
    const dummyData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 10) + 1,
    }))
    setMoodData(dummyData.reverse())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

