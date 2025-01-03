'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { Flame, Target, Calendar, CheckCircle2, XCircle } from 'lucide-react'

interface Habit {
  id: string
  name: string
  category: string
  streak: number
  completion: number
  history: { date: string; completed: boolean }[]
  timeOfDay: string
  consistency: number
}

const habits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'Wellness',
    streak: 15,
    completion: 90,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      completed: Math.random() > 0.2
    })),
    timeOfDay: 'Morning',
    consistency: 85
  },
  {
    id: '2',
    name: 'Daily Exercise',
    category: 'Health',
    streak: 7,
    completion: 75,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      completed: Math.random() > 0.3
    })),
    timeOfDay: 'Evening',
    consistency: 70
  },
  {
    id: '3',
    name: 'Reading',
    category: 'Learning',
    streak: 21,
    completion: 95,
    history: Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      completed: Math.random() > 0.1
    })),
    timeOfDay: 'Night',
    consistency: 92
  }
]

const weeklyData = [
  { day: 'Mon', completed: 5, total: 5 },
  { day: 'Tue', completed: 4, total: 5 },
  { day: 'Wed', completed: 5, total: 5 },
  { day: 'Thu', completed: 3, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 5, total: 5 },
  { day: 'Sun', completed: 4, total: 5 },
]

export function HabitAnalytics() {
  const [selectedHabit, setSelectedHabit] = useState<string>(habits[0].id)
  const [timeframe, setTimeframe] = useState('week')

  const currentHabit = habits.find(h => h.id === selectedHabit)

  return (
    <div className="space-y-6">
      {/* Habit Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Habit Analysis</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedHabit} onValueChange={setSelectedHabit}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select habit" />
              </SelectTrigger>
              <SelectContent>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold">{currentHabit?.streak} days</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-bold">{currentHabit?.completion}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Consistency Score
                    </p>
                    <p className="text-2xl font-bold">{currentHabit?.consistency}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completion Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                <Bar dataKey="total" fill="hsl(var(--muted))" name="Total Habits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Habit Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentHabit?.history.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {day.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>{day.date}</span>
                  </div>
                  <Badge variant={day.completed ? "default" : "secondary"}>
                    {day.completed ? "Completed" : "Missed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Best Time of Day</p>
              <p className="text-sm text-muted-foreground">
                You're most consistent with this habit in the {currentHabit?.timeOfDay.toLowerCase()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Streak Analysis</p>
              <p className="text-sm text-muted-foreground">
                Your current streak of {currentHabit?.streak} days is approaching your best streak
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Success Rate</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Completion</span>
                  <span>{currentHabit?.completion}%</span>
                </div>
                <Progress value={currentHabit?.completion} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 