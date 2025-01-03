'use client'

import { Card, CardContent } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Task } from '../types/task'

interface EisenhowerMatrixProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
}

export function EisenhowerMatrix({ tasks, onUpdateTask }: EisenhowerMatrixProps) {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const updatedTask = tasks.find(task => task.id === result.draggableId)
    if (updatedTask) {
      updatedTask.category = result.destination.droppableId as Task['category']
      onUpdateTask(updatedTask)
    }
  }

  const quadrants: Task['category'][] = [
    'Important & Urgent',
    'Important & Not Urgent',
    'Not Important & Urgent',
    'Not Important & Not Urgent'
  ]

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 gap-4">
        {quadrants.map(quadrant => (
          <Card key={quadrant}>
            <CardContent>
              <h3 className="font-semibold mb-2">{quadrant}</h3>
              <Droppable droppableId={quadrant}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[100px]">
                    {tasks
                      .filter(task => task.category === quadrant)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-2 mb-2 rounded shadow"
                            >
                              {task.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  )
}

