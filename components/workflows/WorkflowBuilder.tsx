'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save, Play, Settings2, ArrowRight, ArrowDown } from 'lucide-react'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition'
  name: string
  description: string
  config: Record<string, any>
}

const stepTemplates = [
  {
    type: 'trigger',
    options: [
      { id: 'schedule', name: 'Schedule', description: 'Run at specified times' },
      { id: 'webhook', name: 'Webhook', description: 'Trigger via HTTP request' },
      { id: 'event', name: 'Event', description: 'React to system events' }
    ]
  },
  {
    type: 'action',
    options: [
      { id: 'task', name: 'Create Task', description: 'Create a new task' },
      { id: 'email', name: 'Send Email', description: 'Send an email notification' },
      { id: 'api', name: 'API Request', description: 'Make an HTTP request' }
    ]
  },
  {
    type: 'condition',
    options: [
      { id: 'if', name: 'If Condition', description: 'Branch based on condition' },
      { id: 'switch', name: 'Switch', description: 'Multiple condition branches' },
      { id: 'loop', name: 'Loop', description: 'Repeat actions' }
    ]
  }
]

export function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('')
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [selectedStepType, setSelectedStepType] = useState<string>('trigger')

  const addStep = (stepTemplate: any) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: selectedStepType as WorkflowStep['type'],
      name: stepTemplate.name,
      description: stepTemplate.description,
      config: {}
    }
    setWorkflowSteps([...workflowSteps, newStep])
  }

  return (
    <div className="space-y-6">
      {/* Workflow Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Input
                placeholder="Workflow Name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-lg font-semibold mb-2"
              />
              <div className="flex gap-2">
                <Badge>Draft</Badge>
                <Badge variant="outline">0 steps</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder */}
      <div className="grid grid-cols-4 gap-6">
        {/* Step Templates */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Step Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedStepType}
                onValueChange={setSelectedStepType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select step type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trigger">Triggers</SelectItem>
                  <SelectItem value="action">Actions</SelectItem>
                  <SelectItem value="condition">Conditions</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                {stepTemplates
                  .find(t => t.type === selectedStepType)
                  ?.options.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => addStep(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                          <Plus className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {workflowSteps.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Drag steps from the left panel or click to add
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Step
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {step.type}
                            </Badge>
                            <h4 className="font-medium">{step.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 py-2">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 