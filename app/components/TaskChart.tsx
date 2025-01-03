'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Task = {
  id: string
  title: string
  status: 'Todo' | 'In Progress' | 'Done'
  timeSpent: number
}

type TaskChartProps = {
  tasks: Task[]
}

export function TaskChart({ tasks }: TaskChartProps) {
  const chartData = [
    { name: 'Todo', value: tasks.filter(task => task.status === 'Todo').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'In Progress').length },
    { name: 'Done', value: tasks.filter(task => task.status === 'Done').length },
  ]

  const totalTimeSpent = tasks.reduce((total, task) => total + task.timeSpent, 0)
  const hours = Math.floor(totalTimeSpent / 60)
  const minutes = totalTimeSpent % 60

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Total Time Spent: {hours} hours {minutes} minutes</p>
        </div>
      </CardContent>
    </Card>
  )
}

