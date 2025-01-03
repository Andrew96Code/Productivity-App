'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'

type Habit = {
  id: string
  name: string
  streak: number
  completedDates: Date[]
}

export function HabitStreak() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', streak: 5, completedDates: [] },
    { id: '2', name: 'Daily Exercise', streak: 3, completedDates: [] },
    { id: '3', name: 'Reading', streak: 7, completedDates: [] },
  ])
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const updateStreak = (habitId: string) => {
    setHabits(habits.map(habit =>
      habit.id === habitId
        ? { ...habit, streak: habit.streak + 1, completedDates: [...habit.completedDates, new Date()] }
        : habit
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{habit.name}</p>
                <p className="text-sm text-gray-500">{habit.streak} day streak</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => updateStreak(habit.id)}>Mark Complete</Button>
                <Button variant="outline" onClick={() => setSelectedHabit(habit)}>View Calendar</Button>
              </div>
            </div>
          ))}
        </div>
        {selectedHabit && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">{selectedHabit.name} - Streak Calendar</h3>
            <Calendar
              mode="multiple"
              selected={selectedHabit.completedDates}
              className="rounded-md border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

