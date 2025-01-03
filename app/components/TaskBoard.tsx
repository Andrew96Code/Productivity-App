'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

type Task = {
  id: string
  content: string
  status: 'todo' | 'inProgress' | 'done'
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'Design user interface', status: 'todo' },
    { id: '2', content: 'Implement backend API', status: 'inProgress' },
    { id: '3', content: 'Write documentation', status: 'done' },
  ])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), content: newTask, status: 'todo' }])
      setNewTask('')
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newTasks = Array.from(tasks)
    const [reorderedItem] = newTasks.splice(result.source.index, 1)
    reorderedItem.status = result.destination.droppableId as 'todo' | 'inProgress' | 'done'
    newTasks.splice(result.destination.index, 0, reorderedItem)

    setTasks(newTasks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Board</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="new-task">New Task</Label>
          <div className="flex space-x-2">
            <Input
              id="new-task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task"
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['todo', 'inProgress', 'done'] as const).map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-4 rounded-md"
                  >
                    <h3 className="font-semibold mb-2">
                      {status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : 'Done'}
                    </h3>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-2 mb-2 rounded shadow"
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

