'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, TrendingUp, Wallet, PiggyBank, Target, ArrowRight } from 'lucide-react'

const financialData = [
  { month: 'Jan', income: 5000, expenses: 4200, savings: 800 },
  { month: 'Feb', income: 5200, expenses: 4000, savings: 1200 },
  { month: 'Mar', income: 5100, expenses: 4300, savings: 800 },
  { month: 'Apr', income: 5300, expenses: 4100, savings: 1200 },
  { month: 'May', income: 5400, expenses: 4200, savings: 1200 },
  { month: 'Jun', income: 5200, expenses: 4000, savings: 1200 },
]

const budgetAllocation = [
  { name: 'Housing', value: 35, color: '#0ea5e9' },
  { name: 'Food', value: 20, color: '#f43f5e' },
  { name: 'Transport', value: 15, color: '#8b5cf6' },
  { name: 'Utilities', value: 10, color: '#10b981' },
  { name: 'Savings', value: 20, color: '#f59e0b' },
]

const goals = [
  {
    title: 'Emergency Fund',
    target: 10000,
    current: 6500,
    deadline: '2024-12-31',
    category: 'Savings'
  },
  {
    title: 'Debt Repayment',
    target: 15000,
    current: 9000,
    deadline: '2024-06-30',
    category: 'Debt'
  }
]

export function FinancialOverview() {
  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Income
                </p>
                <p className="text-2xl font-bold">$5,400</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Expenses
                </p>
                <p className="text-2xl font-bold">$4,200</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <Wallet className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">+2%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Savings
                </p>
                <p className="text-2xl font-bold">$1,200</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <PiggyBank className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-500">+15%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Goal Progress
                </p>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={65} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {budgetAllocation.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Due {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>{goal.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${goal.current.toLocaleString()}</span>
                        <span>${goal.target.toLocaleString()}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 