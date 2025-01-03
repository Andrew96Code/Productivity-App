'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, Zap, ArrowUp, ArrowDown } from 'lucide-react'

const productivityData = [
  { date: 'Mon', tasks: 12, focus: 6.5, meetings: 2 },
  { date: 'Tue', tasks: 8, focus: 5.0, meetings: 3 },
  { date: 'Wed', tasks: 15, focus: 7.5, meetings: 1 },
  { date: 'Thu', tasks: 10, focus: 4.5, meetings: 4 },
  { date: 'Fri', tasks: 14, focus: 6.0, meetings: 2 },
]

const timeDistribution = [
  { name: 'Deep Work', value: 35, color: '#0ea5e9' },
  { name: 'Meetings', value: 25, color: '#f43f5e' },
  { name: 'Planning', value: 15, color: '#8b5cf6' },
  { name: 'Communication', value: 15, color: '#10b981' },
  { name: 'Learning', value: 10, color: '#f59e0b' },
]

const metrics = [
  {
    title: 'Focus Score',
    value: '8.5',
    change: '+0.5',
    trend: 'up',
    icon: Zap,
  },
  {
    title: 'Task Completion',
    value: '92%',
    change: '+5%',
    trend: 'up',
    icon: Target,
  },
  {
    title: 'Deep Work Hours',
    value: '6.2',
    change: '-0.3',
    trend: 'down',
    icon: Clock,
  },
]

export function AdvancedAnalytics() {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change} vs last week
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Productivity Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productivity Trends</CardTitle>
          <Select defaultValue="week">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="focus" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="hsl(var(--muted))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Time Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {timeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 