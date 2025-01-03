'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Clock } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface Todo {
  id: string
  title: string
  completed: boolean
  dueDate: Date
  priority: 'Low' | 'Medium' | 'High'
  tags: string[]
}

interface TodoListProps {
  view?: 'list' | 'calendar'
}

export function TodoList({ view = 'list' }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      completed: false,
      dueDate: new Date(),
      priority: 'High',
      tags: ['Work', 'Important']
    },
    {
      id: '2',
      title: 'Review team updates',
      completed: true,
      dueDate: new Date(),
      priority: 'Medium',
      tags: ['Team']
    }
  ])

  const toggleTodo = (todoId: string) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId))
  }

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <Card key={todo.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <div>
                  <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(todo.dueDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={todo.priority === 'High' ? 'destructive' : 'secondary'}>
                  {todo.priority}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {todo.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {todo.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 