'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate: Date
  priority: 'Low' | 'Medium' | 'High'
}

interface TaskListProps {
  view: 'list' | 'calendar'
}

export function TaskList({ view }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      completed: false,
      dueDate: new Date(),
      priority: 'High'
    },
    {
      id: '2',
      title: 'Review team updates',
      completed: true,
      dueDate: new Date(),
      priority: 'Medium'
    }
  ])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  if (view === 'calendar') {
    return (
      <div className="p-4">
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md border"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>
                {task.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(task.dueDate, 'MMM d')}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 