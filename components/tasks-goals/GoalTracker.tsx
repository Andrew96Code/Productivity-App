'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Target } from 'lucide-react'
import { format } from 'date-fns'

interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: Date
  progress: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  completed: boolean
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: new Date(),
  })

  const categories = [
    'Personal', 'Professional', 'Health', 'Financial', 'Learning', 'Other'
  ]

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      milestones: []
    }

    setGoals([...goals, goal])
    setNewGoal({
      title: '',
      description: '',
      category: '',
      targetDate: new Date(),
    })
  }

  const updateProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, progress } : goal
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Enter your goal..."
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Describe your goal..."
            />
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newGoal.targetDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGoal.targetDate}
                    onSelect={(date) => date && setNewGoal({ ...newGoal, targetDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={addGoal}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{goal.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Due: {format(goal.targetDate, 'PPP')}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{goal.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>
              <Input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                className="w-full"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 