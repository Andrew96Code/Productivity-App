'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit2, Trash2, CheckCircle } from 'lucide-react'

type Milestone = {
  id: string
  description: string
  completed: boolean
}

type Goal = {
  id: string
  title: string
  description: string
  category: string
  target: number
  current: number
  deadline: string
  milestones: Milestone[]
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'milestones'>>({
    title: '',
    description: '',
    category: '',
    target: 0,
    current: 0,
    deadline: ''
  })
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0 && newGoal.deadline) {
      setGoals([...goals, { ...newGoal, id: Date.now().toString(), milestones: [] }])
      setNewGoal({ title: '', description: '', category: '', target: 0, current: 0, deadline: '' })
    }
  }

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, current: Math.min(goal.target, Math.max(0, progress)) } : goal
    ))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const editGoal = (id: string) => {
    setEditingGoalId(id)
    const goalToEdit = goals.find(goal => goal.id === id)
    if (goalToEdit) {
      setNewGoal({
        title: goalToEdit.title,
        description: goalToEdit.description,
        category: goalToEdit.category,
        target: goalToEdit.target,
        current: goalToEdit.current,
        deadline: goalToEdit.deadline
      })
    }
  }

  const saveEditedGoal = () => {
    if (editingGoalId) {
      setGoals(goals.map(goal =>
        goal.id === editingGoalId ? { ...goal, ...newGoal } : goal
      ))
      setEditingGoalId(null)
      setNewGoal({ title: '', description: '', category: '', target: 0, current: 0, deadline: '' })
    }
  }

  const addMilestone = (goalId: string, description: string) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? {
        ...goal,
        milestones: [...goal.milestones, { id: Date.now().toString(), description, completed: false }]
      } : goal
    ))
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? {
        ...goal,
        milestones: goal.milestones.map(milestone =>
          milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
        )
      } : goal
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => editGoal(goal.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Category: {goal.category}</span>
                  <span className="text-sm">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="mb-2" />
                <div className="flex justify-between items-center mb-4">
                  <Input
                    type="number"
                    value={goal.current}
                    onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                    className="w-20"
                  />
                  <span>/ {goal.target}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Milestones</h4>
                  {goal.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center">
                      <Checkbox
                        checked={milestone.completed}
                        onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                      />
                      <span className="ml-2">{milestone.description}</span>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <Input
                      placeholder="New milestone"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addMilestone(goal.id, e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button variant="ghost" size="sm" onClick={() => addMilestone(goal.id, '')}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">{editingGoalId ? 'Edit Goal' : 'Add New Goal'}</h3>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Enter goal title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Enter goal description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newGoal.category}
              onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              value={newGoal.target || ''}
              onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
              placeholder="Enter target value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>
          <Button onClick={editingGoalId ? saveEditedGoal : addGoal} className="w-full">
            {editingGoalId ? 'Save Changes' : 'Add Goal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

