'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Target, Calendar, DollarSign, TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react'

interface Goal {
  id: string
  title: string
  target: number
  current: number
  deadline: string
  category: string
  priority: 'high' | 'medium' | 'low'
  status: 'on-track' | 'at-risk' | 'completed'
  contributions: {
    date: string
    amount: number
  }[]
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    target: 10000,
    current: 6500,
    deadline: '2024-12-31',
    category: 'Savings',
    priority: 'high',
    status: 'on-track',
    contributions: [
      { date: '2024-01-15', amount: 1000 },
      { date: '2024-02-15', amount: 1500 },
      { date: '2024-03-15', amount: 1000 }
    ]
  },
  {
    id: '2',
    title: 'Down Payment',
    target: 50000,
    current: 15000,
    deadline: '2025-06-30',
    category: 'Housing',
    priority: 'medium',
    status: 'at-risk',
    contributions: [
      { date: '2024-01-01', amount: 5000 },
      { date: '2024-02-01', amount: 5000 },
      { date: '2024-03-01', amount: 5000 }
    ]
  }
]

export function FinancialGoals() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
    }
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Goal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Financial Goals</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Title</label>
              <Input placeholder="e.g., Emergency Fund" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Amount</label>
              <Input type="number" placeholder="$10,000" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Deadline</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="debt">Debt Repayment</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{goal.category}</Badge>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${goal.current.toLocaleString()}</span>
                    <span>{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Recent Contributions</h4>
                  <div className="space-y-2">
                    {goal.contributions.slice(0, 3).map((contribution, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{new Date(contribution.date).toLocaleDateString()}</span>
                        <span className="font-medium">
                          +${contribution.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 