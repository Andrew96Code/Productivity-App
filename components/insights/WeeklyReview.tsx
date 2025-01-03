'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { format, startOfWeek, endOfWeek } from 'date-fns'

interface WeeklyGoal {
  id: string
  title: string
  progress: number
  status: 'completed' | 'in-progress' | 'at-risk'
}

const weeklyGoals: WeeklyGoal[] = [
  {
    id: '1',
    title: 'Complete Project Milestone',
    progress: 80,
    status: 'in-progress'
  },
  {
    id: '2',
    title: 'Learn New Framework',
    progress: 100,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Exercise 3 Times',
    progress: 33,
    status: 'at-risk'
  }
]

const reflectionPrompts = [
  "What were your biggest accomplishments this week?",
  "What challenges did you face and how did you overcome them?",
  "What did you learn this week?",
  "What could you have done better?",
  "What are your top priorities for next week?"
]

export function WeeklyReview() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [responses, setResponses] = useState<Record<string, string>>({})

  const weekStart = startOfWeek(selectedDate)
  const weekEnd = endOfWeek(selectedDate)

  const getStatusIcon = (status: WeeklyGoal['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'at-risk':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-primary" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Week Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Review</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
      </Card>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goals Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  <span className="font-medium">{goal.title}</span>
                </div>
                <Badge variant={
                  goal.status === 'completed' ? 'default' :
                  goal.status === 'at-risk' ? 'destructive' : 'secondary'
                }>
                  {goal.status}
                </Badge>
              </div>
              <Progress value={goal.progress} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reflectionPrompts.map((prompt, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium">{prompt}</label>
              <Textarea
                value={responses[prompt] || ''}
                onChange={(e) => setResponses(prev => ({
                  ...prev,
                  [prompt]: e.target.value
                }))}
                placeholder="Write your reflection here..."
                className="min-h-[100px]"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <Button>Save Reflection</Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Week Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">15/20</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Goals Achieved</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">3/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Focus Hours</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">32h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 