'use client'

import { Task } from '../types/task'
import { TaskItem } from './TaskItem'

interface TodoListProps {
  tasks: Task[]
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  onStartTimer: (task: Task) => void
  onOpenDetails: (task: Task) => void
}

export function TodoList({ tasks, onUpdate, onDelete, onStartTimer, onOpenDetails }: TodoListProps) {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onStartTimer={onStartTimer}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  )
}

