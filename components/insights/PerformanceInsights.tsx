'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Target, Clock, Brain, Zap } from 'lucide-react'

const performanceData = [
  { date: 'Mon', productivity: 85, focus: 75, energy: 80 },
  { date: 'Tue', productivity: 75, focus: 80, energy: 70 },
  { date: 'Wed', productivity: 90, focus: 85, energy: 85 },
  { date: 'Thu', productivity: 80, focus: 70, energy: 75 },
  { date: 'Fri', productivity: 85, focus: 90, energy: 90 },
  { date: 'Sat', productivity: 70, focus: 65, energy: 65 },
  { date: 'Sun', productivity: 75, focus: 70, energy: 70 },
]

const insights = [
  {
    title: 'Peak Performance Time',
    description: 'Your productivity peaks between 9 AM and 11 AM',
    trend: 'up',
    metric: '85%',
    icon: Clock
  },
  {
    title: 'Focus Duration',
    description: 'Average deep work sessions last 52 minutes',
    trend: 'up',
    metric: '52min',
    icon: Brain
  },
  {
    title: 'Energy Management',
    description: 'Higher productivity on days with morning exercise',
    trend: 'up',
    metric: '+20%',
    icon: Zap
  }
]

export function PerformanceInsights() {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
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
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                  <div className="flex items-center">
                    {insight.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${insight.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      Trending {insight.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Badge variant="secondary">Pattern</Badge>
              <div className="space-y-1">
                <p className="font-medium">Morning Focus Sessions</p>
                <p className="text-sm text-muted-foreground">
                  Your focus scores are consistently higher during morning sessions.
                  Consider scheduling important tasks between 9 AM and 11 AM.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Badge variant="secondary">Suggestion</Badge>
              <div className="space-y-1">
                <p className="font-medium">Break Optimization</p>
                <p className="text-sm text-muted-foreground">
                  Taking regular 5-minute breaks every 25 minutes has shown to improve
                  your overall productivity by 15%.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Badge variant="secondary">Insight</Badge>
              <div className="space-y-1">
                <p className="font-medium">Energy Management</p>
                <p className="text-sm text-muted-foreground">
                  Days starting with exercise show 20% higher productivity scores.
                  Consider maintaining your morning workout routine.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 