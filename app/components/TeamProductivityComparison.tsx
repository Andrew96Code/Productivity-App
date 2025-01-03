'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type TeamMember = {
  name: string
  tasksCompleted: number
  productivityScore: number
}

export function TeamProductivityComparison() {
  const [teamData, setTeamData] = useState<TeamMember[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const fetchTeamData = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTeamData([
        { name: 'Alice', tasksCompleted: 45, productivityScore: 85 },
        { name: 'Bob', tasksCompleted: 38, productivityScore: 78 },
        { name: 'Charlie', tasksCompleted: 52, productivityScore: 92 },
        { name: 'Diana', tasksCompleted: 41, productivityScore: 81 },
      ])
    }
    fetchTeamData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Productivity Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="tasksCompleted" fill="#8884d8" name="Tasks Completed" />
            <Bar yAxisId="right" dataKey="productivityScore" fill="#82ca9d" name="Productivity Score" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

