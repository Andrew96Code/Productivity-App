'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

type FinancialGoal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function FinancialGoalTracking() {
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000 },
    { id: '2', name: 'Vacation', targetAmount: 5000, currentAmount: 2000 },
    { id: '3', name: 'New Car', targetAmount: 20000, currentAmount: 8000 },
  ])
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0 })

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([...goals, { ...newGoal, id: Date.now().toString(), currentAmount: 0 }])
      setNewGoal({ name: '', targetAmount: 0 })
    }
  }

  const updateGoal = (id: string, amount: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) } : goal
    ))
  }

  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const pieData = goals.map(goal => ({ name: goal.name, value: goal.currentAmount }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Financial Goal Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-goal-name">New Goal</Label>
          <Input
            id="new-goal-name"
            placeholder="Goal name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Target amount"
            value={newGoal.targetAmount || ''}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
          />
          <Button onClick={addGoal} className="w-full">Add Goal</Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Your Financial Goals</h3>
          {goals.map(goal => (
            <div key={goal.id} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span>{goal.name}</span>
                <span>${goal.currentAmount} / ${goal.targetAmount}</span>
              </div>
              <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="mb-2" />
              <div className="flex space-x-2">
                <Button onClick={() => updateGoal(goal.id, 100)} size="sm">Add $100</Button>
                <Button onClick={() => updateGoal(goal.id, 500)} size="sm">Add $500</Button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Savings Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center mt-2">Total Savings: ${totalSavings}</p>
        </div>
      </CardContent>
    </Card>
  )
}

