'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

type TimeBlock = {
  name: string
  value: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF85C0']

export function TimeBlockingAnalysis() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const fetchTimeBlocks = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTimeBlocks([
        { name: 'Deep Work', value: 4 },
        { name: 'Meetings', value: 2 },
        { name: 'Email & Communication', value: 1.5 },
        { name: 'Planning & Review', value: 1 },
        { name: 'Learning & Development', value: 1 },
        { name: 'Breaks', value: 0.5 }
      ])
    }
    fetchTimeBlocks()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Blocking Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={timeBlocks}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {timeBlocks.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

