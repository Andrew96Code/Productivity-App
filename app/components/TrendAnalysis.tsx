'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type PerformanceData = {
  date: string
  productivity: number
  focus: number
  energy: number
}

export function TrendAnalysis() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const generateData = () => {
      const data: PerformanceData[] = []
      const now = new Date()
      for (let i = 0; i < 90; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split('T')[0],
          productivity: Math.random() * 10,
          focus: Math.random() * 10,
          energy: Math.random() * 10,
        })
      }
      return data.reverse()
    }
    setPerformanceData(generateData())
  }, [])

  const filteredData = performanceData.slice(-parseInt(timeRange))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend Analysis</CardTitle>
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
            <Line type="monotone" dataKey="productivity" stroke="#8884d8" />
            <Line type="monotone" dataKey="focus" stroke="#82ca9d" />
            <Line type="monotone" dataKey="energy" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

