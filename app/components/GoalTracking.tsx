'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Goal = {
  id: string
  title: string
  target: number
  current: number
}

export function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const sampleGoals: Goal[] = [
      { id: '1', title: 'Complete 50 tasks', target: 50, current: 32 },
      { id: '2', title: 'Achieve 80% productivity score', target: 80, current: 75 },
      { id: '3', title: 'Maintain 7+ hours of sleep', target: 7, current: 6.5 },
    ]
    setGoals(sampleGoals)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.map((goal) => (
          <div key={goal.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{goal.title}</span>
              <span>{Math.round((goal.current / goal.target) * 100)}%</span>
            </div>
            <Progress value={(goal.current / goal.target) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

