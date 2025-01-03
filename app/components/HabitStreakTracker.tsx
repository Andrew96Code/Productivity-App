'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Habit = {
  name: string
  currentStreak: number
  longestStreak: number
  target: number
}

export function HabitStreakTracker() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const fetchHabits = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHabits([
        { name: 'Daily Meditation', currentStreak: 5, longestStreak: 14, target: 30 },
        { name: 'Exercise', currentStreak: 3, longestStreak: 21, target: 30 },
        { name: 'Reading', currentStreak: 12, longestStreak: 30, target: 30 },
      ])
    }
    fetchHabits()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Streak Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {habits.map((habit, index) => (
            <li key={index}>
              <div className="flex justify-between mb-1">
                <span>{habit.name}</span>
                <span>{habit.currentStreak} days</span>
              </div>
              <Progress value={(habit.currentStreak / habit.target) * 100} />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Target: {habit.target} days</span>
                <span>Longest streak: {habit.longestStreak} days</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

