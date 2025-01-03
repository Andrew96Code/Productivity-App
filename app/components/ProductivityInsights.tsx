'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Task = {
  id: string
  status: 'Todo' | 'In Progress' | 'Done'
  timeSpent: number
  dueDate: Date
}

type ProductivityInsightsProps = {
  tasks: Task[]
}

export function ProductivityInsights({ tasks }: ProductivityInsightsProps) {
  const [productivityData, setProductivityData] = useState<{ date: string; tasksCompleted: number; timeSpent: number }[]>([])

  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const data = last7Days.map(date => {
      const tasksCompletedOnDate = tasks.filter(task => 
        task.status === 'Done' && new Date(task.dueDate).toISOString().split('T')[0] === date
      ).length

      const timeSpentOnDate = tasks.reduce((total, task) => 
        new Date(task.dueDate).toISOString().split('T')[0] === date ? total + task.timeSpent : total, 0
      )

      return {
        date,
        tasksCompleted: tasksCompletedOnDate,
        timeSpent: timeSpentOnDate / 60 // Convert to hours
      }
    })

    setProductivityData(data)
  }, [tasks])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="tasksCompleted" stroke="#8884d8" name="Tasks Completed" />
            <Line yAxisId="right" type="monotone" dataKey="timeSpent" stroke="#82ca9d" name="Time Spent (hours)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

