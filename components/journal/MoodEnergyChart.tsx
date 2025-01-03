'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

const data = [
  { date: 'Mon', mood: 8, energy: 7 },
  { date: 'Tue', mood: 6, energy: 5 },
  { date: 'Wed', mood: 7, energy: 8 },
  { date: 'Thu', mood: 9, energy: 8 },
  { date: 'Fri', mood: 7, energy: 6 },
  { date: 'Sat', mood: 8, energy: 9 },
  { date: 'Sun', mood: 9, energy: 8 },
]

export function MoodEnergyChart() {
  const [timeRange, setTimeRange] = useState('week')

  return (
    <div className="space-y-4">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Past Week</SelectItem>
          <SelectItem value="month">Past Month</SelectItem>
          <SelectItem value="quarter">Past Quarter</SelectItem>
        </SelectContent>
      </Select>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--secondary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 