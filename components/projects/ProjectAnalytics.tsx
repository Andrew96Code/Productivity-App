'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, Clock, Users, Target, AlertCircle } from 'lucide-react'

const projectProgress = [
  { month: 'Jan', planned: 45, actual: 42 },
  { month: 'Feb', planned: 85, actual: 78 },
  { month: 'Mar', planned: 125, actual: 120 },
  { month: 'Apr', planned: 165, actual: 145 },
  { month: 'May', planned: 225, actual: 210 },
  { month: 'Jun', planned: 285, actual: 270 }
]

const taskDistribution = [
  { name: 'Completed', value: 63, color: '#10b981' },
  { name: 'In Progress', value: 25, color: '#f59e0b' },
  { name: 'Blocked', value: 7, color: '#ef4444' },
  { name: 'Not Started', value: 5, color: '#6b7280' }
]

const teamPerformance = [
  { name: 'Design', tasks: 45, completion: 92 },
  { name: 'Development', tasks: 85, completion: 88 },
  { name: 'Testing', tasks: 32, completion: 95 },
  { name: 'Documentation', tasks: 28, completion: 85 }
]

export function ProjectAnalytics() {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Project Progress
                </p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Time Remaining
                </p>
                <p className="text-2xl font-bold">24 days</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={65} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Team Velocity
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">32</p>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Blocked Tasks
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">5</p>
                  <Badge variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Planned"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Task Distribution and Team Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
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
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="tasks"
                    fill="hsl(var(--primary))"
                    name="Tasks Assigned"
                  />
                  <Bar
                    dataKey="completion"
                    fill="hsl(var(--secondary))"
                    name="Completion Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 