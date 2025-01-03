'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Expense = {
  id: string
  date: string
  category: string
  amount: number
  description: string
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', date: '2023-07-01', category: 'Food', amount: 25.50, description: 'Grocery shopping' },
    { id: '2', date: '2023-07-02', category: 'Transportation', amount: 30.00, description: 'Gas' },
    { id: '3', date: '2023-07-03', category: 'Entertainment', amount: 15.00, description: 'Movie ticket' },
  ])
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: '',
    category: '',
    amount: 0,
    description: ''
  })

  const addExpense = () => {
    if (newExpense.date && newExpense.category && newExpense.amount > 0) {
      setExpenses([...expenses, { ...newExpense, id: Date.now().toString() }])
      setNewExpense({ date: '', category: '', amount: 0, description: '' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addExpense}>Add Expense</Button>
        </div>
        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

