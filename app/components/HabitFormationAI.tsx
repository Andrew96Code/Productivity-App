'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

type Habit = {
  id: string
  name: string
  frequency: number
  streak: number
  completed: boolean
}

export function HabitFormationAI() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Meditate', frequency: 7, streak: 3, completed: false },
    { id: '2', name: 'Exercise', frequency: 5, streak: 1, completed: false },
    { id: '3', name: 'Read', frequency: 7, streak: 7, completed: true },
  ])
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 7 })

  const addHabit = () => {
    if (newHabit.name) {
      setHabits([...habits, { ...newHabit, id: Date.now().toString(), streak: 0, completed: false }])
      setNewHabit({ name: '', frequency: 7 })
    }
  }

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ))
  }

  const getAIRecommendation = () => {
    // In a real app, this would call an AI service for personalized recommendations
    alert('AI Recommendation: Try to pair your new habit with an existing routine for better consistency.')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Habit Formation AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-habit">New Habit</Label>
          <div className="flex space-x-2">
            <Input
              id="new-habit"
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Days per week"
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: Number(e.target.value) })}
              min={1}
              max={7}
            />
            <Button onClick={addHabit}>Add Habit</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Your Habits</h3>
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={habit.id}
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
              />
              <Label htmlFor={habit.id}>{habit.name}</Label>
              <span className="text-sm text-gray-500">
                {habit.streak} day streak | {habit.frequency}/week
              </span>
              <Progress value={(habit.streak / habit.frequency) * 100} className="w-24" />
            </div>
          ))}
        </div>

        <Button onClick={getAIRecommendation} className="w-full">
          Get AI Recommendation
        </Button>
      </CardContent>
    </Card>
  )
}

