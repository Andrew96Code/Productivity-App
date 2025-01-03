'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit2 } from 'lucide-react'

type Habit = {
  id: string
  name: string
  description: string
  category: string
  frequency: number
  trackingPeriod: 'daily' | 'weekly' | 'monthly'
  streak: number
  completedDates: string[]
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id' | 'streak' | 'completedDates'>>({
    name: '',
    description: '',category: '',
    frequency: 1,
    trackingPeriod: 'daily'
  })
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (newHabit.name && newHabit.frequency > 0) {
      setHabits([...habits, { ...newHabit, id: Date.now().toString(), streak: 0, completedDates: [] }])
      setNewHabit({ name: '', description: '', category: '', frequency: 1, trackingPeriod: 'daily' })
    }
  }

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
        const streak = calculateStreak(completedDates, habit.frequency, habit.trackingPeriod)
        return { ...habit, completedDates, streak }
      }
      return habit
    }))
  }

  const calculateStreak = (completedDates: string[], frequency: number, trackingPeriod: string) => {
    let streak = 0
    const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const today = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i])
      const daysDifference = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24))

      if (trackingPeriod === 'daily' && daysDifference <= frequency) {
        streak++
      } else if (trackingPeriod === 'weekly' && Math.floor(daysDifference / 7) <= frequency) {
        streak++
      } else if (trackingPeriod === 'monthly' && Math.floor(daysDifference / 30) <= frequency) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  const editHabit = (id: string) => {
    setEditingHabitId(id)
    const habitToEdit = habits.find(habit => habit.id === id)
    if (habitToEdit) {
      setNewHabit({
        name: habitToEdit.name,
        description: habitToEdit.description,
        category: habitToEdit.category,
        frequency: habitToEdit.frequency,
        trackingPeriod: habitToEdit.trackingPeriod
      })
    }
  }

  const saveEditedHabit = () => {
    if (editingHabitId) {
      setHabits(habits.map(habit =>
        habit.id === editingHabitId ? { ...habit, ...newHabit } : habit
      ))
      setEditingHabitId(null)
      setNewHabit({ name: '', description: '', category: '', frequency: 1, trackingPeriod: 'daily' })
    }
  }

  const getDatesForTracking = (trackingPeriod: string) => {
    const dates = []
    const today = new Date()
    let daysToShow = 7

    if (trackingPeriod === 'weekly') {
      daysToShow = 4 // Show 4 weeks
    } else if (trackingPeriod === 'monthly') {
      daysToShow = 3 // Show 3 months
    }

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date()
      if (trackingPeriod === 'daily') {
        date.setDate(today.getDate() - i)
      } else if (trackingPeriod === 'weekly') {
        date.setDate(today.getDate() - i * 7)
      } else if (trackingPeriod === 'monthly') {
        date.setMonth(today.getMonth() - i)
      }
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map(habit => (
            <Card key={habit.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{habit.name}</h3>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => editHabit(habit.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteHabit(habit.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{habit.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Category: {habit.category}</span>
                  <span className="text-sm">Frequency: {habit.frequency} times {habit.trackingPeriod}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Current Streak: {habit.streak} {habit.trackingPeriod}</span>
                </div>
                <div className="flex justify-between">
                  {getDatesForTracking(habit.trackingPeriod).map(date => (
                    <div key={date} className="flex flex-col items-center">
                      <span className="text-xs">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <Checkbox
                        checked={habit.completedDates.includes(date)}
                        onCheckedChange={() => toggleHabit(habit.id, date)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">{editingHabitId ? 'Edit Habit' : 'Add New Habit'}</h3>
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit Name</Label>
            <Input
              id="habitName"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="Enter habit name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              placeholder="Enter habit description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newHabit.category}
              onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Personal Development">Personal Development</SelectItem>
                <SelectItem value="Relationships">Relationships</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              type="number"
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trackingPeriod">Tracking Period</Label>
            <Select
              value={newHabit.trackingPeriod}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setNewHabit({ ...newHabit, trackingPeriod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tracking period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={editingHabitId ? saveEditedHabit : addHabit} className="w-full">
            {editingHabitId ? 'Save Changes' : 'Add Habit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

