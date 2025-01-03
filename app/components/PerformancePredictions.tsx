'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type PredictionData = {
  date: string
  actual: number
  predicted: number
}

export function PerformancePredictions() {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an AI model or API
    const generateData = () => {
      const data: PredictionData[] = []
      const now = new Date()
      for (let i = -30; i < 30; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split('T')[0],
          actual: i < 0 ? Math.random() * 10 : 0,
          predicted: Math.random() * 10,
        })
      }
      return data
    }
    setPredictionData(generateData())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

