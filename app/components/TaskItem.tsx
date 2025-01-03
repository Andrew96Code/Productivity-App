'use client'

import { Task } from '../types/task'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Clock } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  onStartTimer: (task: Task) => void
  onOpenDetails: (task: Task) => void
}

export function TaskItem({ task, onUpdate, onDelete, onStartTimer, onOpenDetails }: TaskItemProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                onUpdate({ ...task, completed: !!checked })
              }}
            />
            <span className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{task.priority}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onOpenDetails(task)}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStartTimer(task)}>Start Timer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Due: {task.dueDate.toLocaleDateString()}</span>
          </div>
        </div>
        {task.tags.length > 0 && (
          <div className="mt-2">
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 