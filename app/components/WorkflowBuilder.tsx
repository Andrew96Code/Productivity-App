'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

type WorkflowStep = {
  id: string
  type: string
  config: Record<string, string>
}

export function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('')
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [newStepType, setNewStepType] = useState('')

  const addStep = () => {
    if (newStepType) {
      const newStep: WorkflowStep = {
        id: Date.now().toString(),
        type: newStepType,
        config: {},
      }
      setSteps([...steps, newStep])
      setNewStepType('')
    }
  }

  const updateStepConfig = (stepId: string, key: string, value: string) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, config: { ...step.config, [key]: value } } : step
    ))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newSteps = Array.from(steps)
    const [reorderedItem] = newSteps.splice(result.source.index, 1)
    newSteps.splice(result.destination.index, 0, reorderedItem)

    setSteps(newSteps)
  }

  const saveWorkflow = () => {
    console.log('Saving workflow:', { name: workflowName, steps })
    // In a real app, this would save the workflow to a backend or local storage
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={newStepType} onValueChange={setNewStepType}>
              <SelectTrigger>
                <SelectValue placeholder="Select step type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="delay">Delay</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addStep}>Add Step</Button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 p-4 rounded-md"
                        >
                          <h3 className="font-semibold mb-2">{step.type}</h3>
                          {step.type === 'task' && (
                            <Input
                              value={step.config.taskName || ''}
                              onChange={(e) => updateStepConfig(step.id, 'taskName', e.target.value)}
                              placeholder="Task name"
                              className="mb-2"
                            />
                          )}
                          {step.type === 'email' && (
                            <Input
                              value={step.config.recipient || ''}
                              onChange={(e) => updateStepConfig(step.id, 'recipient', e.target.value)}
                              placeholder="Recipient email"
                              className="mb-2"
                            />
                          )}
                          {step.type === 'notification' && (
                            <Input
                              value={step.config.message || ''}
                              onChange={(e) => updateStepConfig(step.id, 'message', e.target.value)}
                              placeholder="Notification message"
                              className="mb-2"
                            />
                          )}
                          {step.type === 'delay' && (
                            <Input
                              type="number"
                              value={step.config.minutes || ''}
                              onChange={(e) => updateStepConfig(step.id, 'minutes', e.target.value)}
                              placeholder="Delay in minutes"
                              className="mb-2"
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={saveWorkflow}>Save Workflow</Button>
        </div>
      </CardContent>
    </Card>
  )
}

