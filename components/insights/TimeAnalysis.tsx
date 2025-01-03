'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts'
import { Clock, Zap, Brain, Coffee } from 'lucide-react'

const hourlyData = [
  { hour: '6AM', productivity: 60, focus: 65, energy: 70 },
  { hour: '8AM', productivity: 85, focus: 90, energy: 85 },
  { hour: '10AM', productivity: 95, focus: 95, energy: 90 },
  { hour: '12PM', productivity: 75, focus: 70, energy: 65 },
  { hour: '2PM', productivity: 80, focus: 75, energy: 75 },
  { hour: '4PM', productivity: 85, focus: 80, energy: 80 },
  { hour: '6PM', productivity: 70, focus: 65, energy: 60 },
]

const timeDistribution = [
  { activity: 'Deep Work', hours: 4.5, percentage: 56 },
  { activity: 'Meetings', hours: 2, percentage: 25 },
  { activity: 'Breaks', hours: 1, percentage: 12.5 },
  { activity: 'Admin', hours: 0.5, percentage: 6.5 },
]

const insights = [
  {
    title: 'Peak Performance',
    description: '10 AM is your most productive hour',
    metric: '95%',
    trend: 'productivity',
    icon: Zap,
  },
  {
    title: 'Focus Time',
    description: 'Longest focus block: 90 minutes',
    metric: '90min',
    trend: 'focus',
    icon: Brain,
  },
  {
    title: 'Break Pattern',
    description: 'Optimal break interval: every 52 minutes',
    metric: '52min',
    trend: 'break',
    icon: Coffee,
  },
]

export function TimeAnalysis() {
  const [timeframe, setTimeframe] = useState('today')

  return (
    <div className="space-y-6">
      {/* Time Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {insight.title}
                    </p>
                    <p className="text-2xl font-bold">{insight.metric}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Productivity by Hour */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Energy Pattern</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="productivity"
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
                  dataKey="energy"
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
            <div className="space-y-4">
              {timeDistribution.map((item) => (
                <div key={item.activity} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.activity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.hours}h</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={item.percentage} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="activity" type="category" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="hsl(var(--primary))">
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 