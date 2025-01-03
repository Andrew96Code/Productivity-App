'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, Clock, Target, Activity, Zap } from 'lucide-react'

const executionData = [
  { date: '2024-02-10', successful: 45, failed: 2 },
  { date: '2024-02-11', successful: 52, failed: 1 },
  { date: '2024-02-12', successful: 48, failed: 3 },
  { date: '2024-02-13', successful: 55, failed: 2 },
  { date: '2024-02-14', successful: 50, failed: 1 },
  { date: '2024-02-15', successful: 58, failed: 0 },
  { date: '2024-02-16', successful: 54, failed: 2 }
]

const workflowDistribution = [
  { name: 'Task Management', value: 35, color: '#0ea5e9' },
  { name: 'Communication', value: 25, color: '#f43f5e' },
  { name: 'Project Updates', value: 20, color: '#8b5cf6' },
  { name: 'Data Processing', value: 20, color: '#10b981' }
]

const performanceByWorkflow = [
  { name: 'Daily Task Processing', executions: 245, successRate: 98, avgDuration: 45 },
  { name: 'Weekly Reports', executions: 52, successRate: 96, avgDuration: 120 },
  { name: 'Email Notifications', executions: 520, successRate: 99, avgDuration: 15 },
  { name: 'Data Sync', executions: 124, successRate: 95, avgDuration: 180 }
]

export function WorkflowAnalytics() {
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">97.5%</p>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2.1%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Activity className="h-6 w-6 text-green-500" />
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
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">941</p>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Duration
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">45s</p>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    +5s
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Workflows
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">12</p>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="successful"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Successful"
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Distribution and Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workflowDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workflowDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceByWorkflow.map((workflow) => (
                <div key={workflow.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{workflow.name}</span>
                    <Badge variant="outline">{workflow.executions} runs</Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Success Rate: {workflow.successRate}%</span>
                    <span>Avg Duration: {workflow.avgDuration}s</span>
                  </div>
                  <Progress value={workflow.successRate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 