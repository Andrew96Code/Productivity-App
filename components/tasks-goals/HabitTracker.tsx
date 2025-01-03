'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Flame, Calendar as CalendarIcon, Trophy } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'

interface Habit {
  id: string
  title: string
  frequency: 'daily' | 'weekly'
  category: string
  streak: number
  completedDates: string[]
  color: string
}

const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
]

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState({
    title: '',
    frequency: 'daily' as const,
    category: '',
  })

  const categories = ['Health', 'Productivity', 'Learning', 'Mindfulness', 'Other']
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const addHabit = () => {
    if (!newHabit.title.trim()) return

    const habit: Habit = {
      id: Date.now().toString(),
      ...newHabit,
      streak: 0,
      completedDates: [],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }

    setHabits([...habits, habit])
    setNewHabit({
      title: '',
      frequency: 'daily',
      category: '',
    })
  }

  const toggleHabitCompletion = (habitId: string, dateStr: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit

      const completedDates = habit.completedDates.includes(dateStr)
        ? habit.completedDates.filter(d => d !== dateStr)
        : [...habit.completedDates, dateStr]

      // Calculate streak
      const streak = calculateStreak(completedDates)

      return {
        ...habit,
        completedDates,
        streak,
      }
    }))
  }

  const calculateStreak = (dates: string[]) => {
    // Simple streak calculation - can be enhanced based on requirements
    return dates.length
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Title</Label>
              <Input
                id="title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                placeholder="Enter habit name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={newHabit.frequency}
                onValueChange={(value: 'daily' | 'weekly') => 
                  setNewHabit({ ...newHabit, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newHabit.category}
                onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={addHabit}>
              <Plus className="mr-2 h-4 w-4" />
              Create Habit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {habits.map(habit => (
          <Card key={habit.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-8 rounded ${habit.color}`} />
                  <div>
                    <CardTitle>{habit.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {habit.frequency} • {habit.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {habit.streak} day streak
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {Math.floor(habit.completedDates.length / 7)} weeks
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  const isCompleted = habit.completedDates.includes(dateStr)
                  return (
                    <div key={dateStr} className="text-center space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {format(date, 'EEE')}
                      </p>
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleHabitCompletion(habit.id, dateStr)}
                        className="mx-auto"
                      />
                    </div>
                  )
                })}
              </div>
              <Progress 
                value={(habit.completedDates.length / 7) * 100} 
                className="mt-4"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 