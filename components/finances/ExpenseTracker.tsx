'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, Plus, Search, Filter, Calendar as CalendarIcon } from 'lucide-react'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
  paymentMethod: string
  receipt?: string
  tags: string[]
}

const expenses: Expense[] = [
  {
    id: '1',
    date: '2024-03-15',
    description: 'Grocery Shopping',
    amount: 125.50,
    category: 'Food',
    paymentMethod: 'Credit Card',
    tags: ['groceries', 'essentials']
  },
  {
    id: '2',
    date: '2024-03-14',
    description: 'Gas Station',
    amount: 45.00,
    category: 'Transportation',
    paymentMethod: 'Debit Card',
    tags: ['car', 'fuel']
  },
  {
    id: '3',
    date: '2024-03-14',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    tags: ['subscription', 'streaming']
  }
]

const weeklyExpenses = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 75 },
  { day: 'Wed', amount: 125 },
  { day: 'Thu', amount: 60 },
  { day: 'Fri', amount: 140 },
  { day: 'Sat', amount: 95 },
  { day: 'Sun', amount: 35 }
]

export function ExpenseTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState('')

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const averageExpense = totalExpenses / expenses.length

  return (
    <div className="space-y-6">
      {/* Add New Expense */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Track Expenses</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input placeholder="What did you spend on?" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="number" className="pl-9" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input type="date" value={selectedDate.toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Payment Method</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Expenses</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{expense.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{expense.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${expense.amount.toFixed(2)}</p>
                      <div className="flex gap-2 mt-1">
                        {expense.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 