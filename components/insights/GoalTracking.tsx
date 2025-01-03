'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

interface Goal {
  id: string
  title: string
  category: string
  progress: number
  dueDate: string
  status: 'on-track' | 'at-risk' | 'completed'
  milestones: { title: string; completed: boolean }[]
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Complete Project Milestones',
    category: 'Work',
    progress: 75,
    dueDate: '2024-03-30',
    status: 'on-track',
    milestones: [
      { title: 'Phase 1 Planning', completed: true },
      { title: 'Development Sprint', completed: true },
      { title: 'Testing Phase', completed: false },
      { title: 'Deployment', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Learn New Framework',
    category: 'Learning',
    progress: 60,
    dueDate: '2024-04-15',
    status: 'at-risk',
    milestones: [
      { title: 'Complete Basics', completed: true },
      { title: 'Build Sample App', completed: false },
      { title: 'Advanced Features', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Fitness Goal',
    category: 'Health',
    progress: 90,
    dueDate: '2024-03-01',
    status: 'completed',
    milestones: [
      { title: 'Set Routine', completed: true },
      { title: 'Monthly Target', completed: true },
      { title: 'Final Goal', completed: true }
    ]
  }
]

const categoryProgress = [
  { category: 'Work', completed: 8, total: 10 },
  { category: 'Learning', completed: 5, total: 8 },
  { category: 'Health', completed: 6, total: 6 },
  { category: 'Personal', completed: 4, total: 5 }
]

export function GoalTracking() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'at-risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Target className="h-5 w-5 text-blue-500" />
    }
  }

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter(goal => goal.category.toLowerCase() === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Category Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Goal Progress by Category</CardTitle>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredGoals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(goal.status)}
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{goal.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Due: {goal.dueDate}
                        </span>
                      </div>
                    </div>
                    <Badge variant={
                      goal.status === 'completed' ? 'default' :
                      goal.status === 'at-risk' ? 'destructive' : 'secondary'
                    }>
                      {goal.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Milestones</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${
                            milestone.completed ? 'text-green-500' : 'text-muted-foreground'
                          }`} />
                          <span className="text-sm">{milestone.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 