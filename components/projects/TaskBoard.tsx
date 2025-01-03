'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Clock, AlertCircle } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  deadline?: string
  assignee?: {
    id: string
    name: string
    avatar: string
  }
  tags: string[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Design Homepage',
        description: 'Create new homepage mockups based on feedback',
        priority: 'high',
        deadline: '2024-03-20',
        assignee: {
          id: '1',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg'
        },
        tags: ['design', 'website']
      },
      {
        id: '2',
        title: 'API Documentation',
        description: 'Update API documentation with new endpoints',
        priority: 'medium',
        deadline: '2024-03-25',
        tags: ['documentation', 'api']
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'User Authentication',
        description: 'Implement OAuth2 authentication flow',
        priority: 'high',
        deadline: '2024-03-18',
        assignee: {
          id: '2',
          name: 'Alex Thompson',
          avatar: '/avatars/alex.jpg'
        },
        tags: ['backend', 'security']
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Mobile Navigation',
        description: 'Review mobile navigation implementation',
        priority: 'medium',
        deadline: '2024-03-15',
        assignee: {
          id: '3',
          name: 'Maria Garcia',
          avatar: '/avatars/maria.jpg'
        },
        tags: ['mobile', 'ui']
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Database Schema',
        description: 'Design and implement database schema',
        priority: 'high',
        assignee: {
          id: '4',
          name: 'James Wilson',
          avatar: '/avatars/james.jpg'
        },
        tags: ['database', 'backend']
      }
    ]
  }
]

export function TaskBoard() {
  const [columns, setColumns] = useState(initialColumns)
  const [searchQuery, setSearchQuery] = useState('')

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)
    const task = sourceColumn?.tasks[source.index]

    if (!sourceColumn || !destColumn || !task) return

    const newColumns = columns.map(col => {
      // Remove from source column
      if (col.id === source.droppableId) {
        const newTasks = [...col.tasks]
        newTasks.splice(source.index, 1)
        return { ...col, tasks: newTasks }
      }
      // Add to destination column
      if (col.id === destination.droppableId) {
        const newTasks = [...col.tasks]
        newTasks.splice(destination.index, 0, task)
        return { ...col, tasks: newTasks }
      }
      return col
    })

    setColumns(newColumns)
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Task Board Header */}
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <div key={column.id}>
              <Card>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {column.tasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 min-h-[200px]"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium">{task.title}</h4>
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                  </div>

                                  <p className="text-sm text-muted-foreground">
                                    {task.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {task.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    {task.assignee ? (
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={task.assignee.avatar}
                                          alt={task.assignee.name}
                                        />
                                        <AvatarFallback>
                                          {task.assignee.name[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <div className="h-8 w-8" />
                                    )}

                                    {task.deadline && (
                                      <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                          {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  )
} 