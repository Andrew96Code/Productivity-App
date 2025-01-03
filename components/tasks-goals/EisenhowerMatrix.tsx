'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MatrixTask {
  id: string
  title: string
  quadrant: 'q1' | 'q2' | 'q3' | 'q4'
}

interface QuadrantConfig {
  title: string
  description: string
  color: string
  action: string
}

const quadrants: Record<MatrixTask['quadrant'], QuadrantConfig> = {
  q1: {
    title: 'Urgent & Important',
    description: 'Do it now',
    color: 'bg-red-100 dark:bg-red-900/20',
    action: 'Do'
  },
  q2: {
    title: 'Important, Not Urgent',
    description: 'Schedule it',
    color: 'bg-blue-100 dark:bg-blue-900/20',
    action: 'Plan'
  },
  q3: {
    title: 'Urgent, Not Important',
    description: 'Delegate it',
    color: 'bg-yellow-100 dark:bg-yellow-900/20',
    action: 'Delegate'
  },
  q4: {
    title: 'Not Urgent & Not Important',
    description: 'Eliminate it',
    color: 'bg-gray-100 dark:bg-gray-900/20',
    action: 'Delete'
  }
}

export function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<MatrixTask[]>([])
  const [newTask, setNewTask] = useState('')
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixTask['quadrant']>('q1')

  const addTask = () => {
    if (!newTask.trim()) return

    const task: MatrixTask = {
      id: Date.now().toString(),
      title: newTask,
      quadrant: selectedQuadrant,
    }

    setTasks([...tasks, task])
    setNewTask('')
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const moveTask = (taskId: string, newQuadrant: MatrixTask['quadrant']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, quadrant: newQuadrant } : task
    ))
  }

  const QuadrantCard = ({ quadrant }: { quadrant: MatrixTask['quadrant'] }) => {
    const config = quadrants[quadrant]
    const quadrantTasks = tasks.filter(task => task.quadrant === quadrant)

    return (
      <Card className={cn("h-full", config.color)}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quadrantTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 bg-background/50 rounded-md"
              >
                <span className="text-sm">{task.title}</span>
                <div className="flex items-center gap-2">
                  <select
                    className="text-xs bg-transparent"
                    value={task.quadrant}
                    onChange={(e) => moveTask(task.id, e.target.value as MatrixTask['quadrant'])}
                  >
                    {Object.entries(quadrants).map(([key, { title }]) => (
                      <option key={key} value={key}>
                        Move to {title}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="newTask">Task Title</Label>
              <Input
                id="newTask"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task..."
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                className="w-full p-2 rounded-md border"
                value={selectedQuadrant}
                onChange={(e) => setSelectedQuadrant(e.target.value as MatrixTask['quadrant'])}
              >
                {Object.entries(quadrants).map(([key, { title }]) => (
                  <option key={key} value={key}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={addTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <QuadrantCard quadrant="q1" />
        <QuadrantCard quadrant="q2" />
        <QuadrantCard quadrant="q3" />
        <QuadrantCard quadrant="q4" />
      </div>
    </div>
  )
} 