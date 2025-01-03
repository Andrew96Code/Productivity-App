'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, Target, Brain, Clock, Calendar } from 'lucide-react'

const weeklyCompletion = [
  { week: 'Week 1', completion: 85, target: 100 },
  { week: 'Week 2', completion: 92, target: 100 },
  { week: 'Week 3', completion: 78, target: 100 },
  { week: 'Week 4', completion: 95, target: 100 }
]

const habitDistribution = [
  { name: 'Morning', value: 45, color: '#0ea5e9' },
  { name: 'Afternoon', value: 30, color: '#f43f5e' },
  { name: 'Evening', value: 25, color: '#8b5cf6' }
]

const categoryPerformance = [
  { category: 'Health', completed: 92, missed: 8 },
  { category: 'Learning', completed: 85, missed: 15 },
  { category: 'Productivity', completed: 78, missed: 22 },
  { category: 'Mindfulness', completed: 88, missed: 12 }
]

export function HabitAnalytics() {
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Average Completion
                </p>
                <p className="text-2xl font-bold">87.5%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={87.5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Best Time of Day
                </p>
                <p className="text-2xl font-bold">Morning</p>
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
                  Best Category
                </p>
                <p className="text-2xl font-bold">Health</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Weekly Target
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">95%</p>
                  <Badge variant="secondary">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2.5%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Target className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Completion Rate"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--muted))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Time Distribution and Category Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time of Day Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={habitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {habitDistribution.map((entry, index) => (
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
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="hsl(var(--primary))"
                    name="Completed"
                  />
                  <Bar
                    dataKey="missed"
                    stackId="a"
                    fill="hsl(var(--destructive))"
                    name="Missed"
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