'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DollarSign, Plus, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

const categories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Housing',
    budgeted: 2000,
    spent: 1950,
    color: '#0ea5e9'
  },
  {
    id: '2',
    name: 'Food',
    budgeted: 600,
    spent: 520,
    color: '#f43f5e'
  },
  {
    id: '3',
    name: 'Transportation',
    budgeted: 400,
    spent: 385,
    color: '#8b5cf6'
  },
  {
    id: '4',
    name: 'Utilities',
    budgeted: 300,
    spent: 275,
    color: '#10b981'
  },
  {
    id: '5',
    name: 'Entertainment',
    budgeted: 200,
    spent: 250,
    color: '#f59e0b'
  }
]

export function BudgetPlanner() {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remainingBudget = totalBudgeted - totalSpent

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </p>
                <p className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(totalSpent / totalBudgeted) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Remaining
                </p>
                <p className="text-2xl font-bold">${remainingBudget.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Budget Allocation</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="budgeted"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    ${category.budgeted.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>${category.spent.toLocaleString()} spent</span>
                        <span>of</span>
                        <span>${category.budgeted.toLocaleString()}</span>
                      </div>
                    </div>
                    {category.spent > category.budgeted && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Over Budget
                      </Badge>
                    )}
                  </div>
                  <Progress 
                    value={(category.spent / category.budgeted) * 100}
                    className={category.spent > category.budgeted ? 'text-destructive' : ''}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 