'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Calendar as CalendarIcon, CheckCircle2, XCircle, Bell } from 'lucide-react'

interface HabitLog {
  id: string
  name: string
  category: string
  frequency: string
  timeOfDay: string
  streak: number
  completedDates: string[]
  reminder: string
  notes: string[]
}

const habits: HabitLog[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'Mindfulness',
    frequency: 'Daily',
    timeOfDay: 'Morning',
    streak: 12,
    completedDates: [
      '2024-03-14',
      '2024-03-15',
      '2024-03-16'
    ],
    reminder: '7:00 AM',
    notes: [
      'Felt more focused today',
      'Struggled to stay present'
    ]
  },
  {
    id: '2',
    name: 'Reading',
    category: 'Learning',
    frequency: 'Daily',
    timeOfDay: 'Evening',
    streak: 5,
    completedDates: [
      '2024-03-15',
      '2024-03-16'
    ],
    reminder: '8:00 PM',
    notes: [
      'Finished chapter 3',
      'Great reading session'
    ]
  }
]

export function HabitTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState('')

  const isHabitCompletedOnDate = (habit: HabitLog, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return habit.completedDates.includes(dateString)
  }

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daily Habit Tracker</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search habits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="space-y-4">
                {habits.map((habit) => (
                  <Card key={habit.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isHabitCompletedOnDate(habit, selectedDate)}
                          onCheckedChange={() => {}}
                          className="h-6 w-6"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{habit.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{habit.timeOfDay}</span>
                                <span>•</span>
                                <span>{habit.frequency}</span>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {habit.streak} day streak
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />

              <div className="mt-4">
                <h3 className="font-medium mb-2">Notes for {selectedDate.toLocaleDateString()}</h3>
                <div className="space-y-2">
                  {habits.map((habit) => (
                    isHabitCompletedOnDate(habit, selectedDate) && (
                      <Card key={habit.id}>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-sm mb-2">{habit.name}</h4>
                          {habit.notes.map((note, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="mt-1">
                                {index === 0 ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <p className="text-muted-foreground">{note}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date()
              date.setDate(date.getDate() - (6 - index))
              const dateString = date.toISOString().split('T')[0]
              const completedHabits = habits.filter(h => h.completedDates.includes(dateString))

              return (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {completedHabits.length}/{habits.length}
                    </p>
                    <div className="mt-2">
                      {completedHabits.length === habits.length ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <Progress value={(completedHabits.length / habits.length) * 100} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 