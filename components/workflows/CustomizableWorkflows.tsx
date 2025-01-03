'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Play, Clock, Settings2, ArrowRight, Filter } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  category: string
  lastRun: string
  nextRun: string
  successRate: number
  steps: number
  integrations: string[]
}

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'Daily Task Processing',
    description: 'Automatically organize and prioritize incoming tasks',
    status: 'active',
    category: 'Task Management',
    lastRun: '2024-02-15T08:00:00',
    nextRun: '2024-02-16T08:00:00',
    successRate: 98,
    steps: 5,
    integrations: ['Todoist', 'Gmail', 'Calendar']
  },
  {
    id: '2',
    name: 'Weekly Report Generation',
    description: 'Compile and send weekly progress reports',
    status: 'active',
    category: 'Reporting',
    lastRun: '2024-02-12T09:00:00',
    nextRun: '2024-02-19T09:00:00',
    successRate: 95,
    steps: 8,
    integrations: ['Sheets', 'Slack', 'Email']
  }
]

export function CustomizableWorkflows() {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'draft':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Workflows
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Play className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Executions
                </p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">96.5%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Progress value={96.5} className="w-[60px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Integrations
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Settings2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Workflows</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{workflow.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Run</p>
                      <p className="font-medium">
                        {new Date(workflow.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Run</p>
                      <p className="font-medium">
                        {new Date(workflow.nextRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.successRate} className="w-[60px]" />
                        <span>{workflow.successRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {workflow.integrations.map((integration) => (
                        <Badge key={integration} variant="secondary">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings2 className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 