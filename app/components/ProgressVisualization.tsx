'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ProgressData = {
  date: string
  goals: number
  habits: number
}

export function ProgressVisualization() {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const generateData = () => {
      const data: ProgressData[] = []
      const now = new Date()
      for (let i = 0; i < 90; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split('T')[0],
          goals: Math.floor(Math.random() * 10),
          habits: Math.floor(Math.random() * 10),
        })
      }
      return data.reverse()
    }
    setProgressData(generateData())
  }, [])

  const filteredData = progressData.slice(-parseInt(timeRange))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Visualization</CardTitle>
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="goals" stroke="#8884d8" name="Goals Achieved" />
            <Line type="monotone" dataKey="habits" stroke="#82ca9d" name="Habits Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

