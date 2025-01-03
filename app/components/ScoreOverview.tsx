'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ScoreData = {
  date: string
  daily?: number
  weekly?: number
  monthly?: number
}

export function ScoreOverview() {
  const [scoreData, setScoreData] = useState<ScoreData[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your backend or local storage
    // For this example, we'll generate some dummy data
    const dummyData: ScoreData[] = []
    const today = new Date()
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dummyData.push({
        date: date.toISOString().split('T')[0],
        daily: Math.floor(Math.random() * 10) + 1,
        weekly: i % 7 === 0 ? Math.floor(Math.random() * 10) + 1 : undefined,
        monthly: i % 30 === 0 ? Math.floor(Math.random() * 10) + 1 : undefined,
      })
    }
    setScoreData(dummyData)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="daily" stroke="#8884d8" name="Daily Score" />
            <Line type="monotone" dataKey="weekly" stroke="#82ca9d" name="Weekly Score" connectNulls={true} />
            <Line type="monotone" dataKey="monthly" stroke="#ffc658" name="Monthly Score" connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

