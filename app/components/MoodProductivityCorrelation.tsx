'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type DataPoint = {
  mood: number
  productivity: number
}

export function MoodProductivityCorrelation() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const fetchData = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const generatedData = Array.from({ length: 30 }, () => ({
        mood: Math.random() * 10,
        productivity: Math.random() * 10,
      }))
      setData(generatedData)
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood-Productivity Correlation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="mood" name="Mood" unit="/10" />
            <YAxis type="number" dataKey="productivity" name="Productivity" unit="/10" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Mood vs Productivity" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

