'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Action = {
  id: string
  type: 'email' | 'notification' | 'task'
  details: string
}

type Trigger = {
  id: string
  event: string
  condition: string
}

type Workflow = {
  id: string
  name: string
  trigger: Trigger
  actions: Action[]
}

export function CustomizableWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Task Overdue Reminder',
      trigger: { id: '1', event: 'task_overdue', condition: 'days_overdue > 2' },
      actions: [
        { id: '1', type: 'email', details: 'Send reminder email' },
        { id: '2', type: 'notification', details: 'Send push notification' },
      ]
    }
  ])
  const [newWorkflow, setNewWorkflow] = useState<Workflow>({
    id: '',
    name: '',
    trigger: { id: '', event: '', condition: '' },
    actions: []
  })
  const [newAction, setNewAction] = useState<Action>({ id: '', type: 'email', details: '' })

  const addWorkflow = () => {
    if (newWorkflow.name && newWorkflow.trigger.event) {
      setWorkflows([...workflows, { ...newWorkflow, id: Date.now().toString() }])
      setNewWorkflow({ id: '', name: '', trigger: { id: '', event: '', condition: '' }, actions: [] })
    }
  }

  const addAction = () => {
    if (newAction.type && newAction.details) {
      setNewWorkflow({
        ...newWorkflow,
        actions: [...newWorkflow.actions, { ...newAction, id: Date.now().toString() }]
      })
      setNewAction({ id: '', type: 'email', details: '' })
    }
  }

  const runWorkflow = (id: string) => {
    // In a real app, this would trigger the workflow
    alert(`Running workflow: ${workflows.find(w => w.id === id)?.name}`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customizable Workflows</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workflow-name">New Workflow</Label>
          <Input
            id="workflow-name"
            placeholder="Workflow name"
            value={newWorkflow.name}
            onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
          />
          <Select
            value={newWorkflow.trigger.event}
            onValueChange={(value) => setNewWorkflow({
              ...newWorkflow,
              trigger: { ...newWorkflow.trigger, event: value }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task_created">Task Created</SelectItem>
              <SelectItem value="task_completed">Task Completed</SelectItem>
              <SelectItem value="task_overdue">Task Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Trigger condition (optional)"
            value={newWorkflow.trigger.condition}
            onChange={(e) => setNewWorkflow({
              ...newWorkflow,
              trigger: { ...newWorkflow.trigger, condition: e.target.value }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Actions</Label>
          {newWorkflow.actions.map((action, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>{action.type}:</span>
              <span>{action.details}</span>
            </div>
          ))}
          <Select
            value={newAction.type}
            onValueChange={(value: 'email' | 'notification' | 'task') => setNewAction({ ...newAction, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Send Email</SelectItem>
              <SelectItem value="notification">Send Notification</SelectItem>
              <SelectItem value="task">Create Task</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Action details"
            value={newAction.details}
            onChange={(e) => setNewAction({ ...newAction, details: e.target.value })}
          />
          <Button onClick={addAction}>Add Action</Button>
        </div>

        <Button onClick={addWorkflow} className="w-full">Create Workflow</Button>

        <div>
          <h3 className="text-lg font-semibold mb-2">Your Workflows</h3>
          {workflows.map(workflow => (
            <div key={workflow.id} className="mb-4 p-4 border rounded">
              <h4 className="font-medium">{workflow.name}</h4>
              <p className="text-sm text-gray-500">
                Trigger: {workflow.trigger.event} {workflow.trigger.condition && `(${workflow.trigger.condition})`}
              </p>
              <ul className="list-disc list-inside">
                {workflow.actions.map((action, index) => (
                  <li key={index} className="text-sm">
                    {action.type}: {action.details}
                  </li>
                ))}
              </ul>
              <Button onClick={() => runWorkflow(workflow.id)} className="mt-2">Run Workflow</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

