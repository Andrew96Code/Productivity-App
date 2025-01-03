'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2024-01-01', mood: 7 },
  { date: '2024-01-02', mood: 8 },
  { date: '2024-01-03', mood: 6 },
  { date: '2024-01-04', mood: 9 },
  { date: '2024-01-05', mood: 7 },
]

export function MoodAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 