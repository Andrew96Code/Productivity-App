'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react'

const trendData = [
  { month: 'Jan', productivity: 75, focus: 70, goals: 65 },
  { month: 'Feb', productivity: 68, focus: 75, goals: 70 },
  { month: 'Mar', productivity: 80, focus: 85, goals: 75 },
  { month: 'Apr', productivity: 85, focus: 80, goals: 80 },
  { month: 'May', productivity: 90, focus: 85, goals: 85 },
  { month: 'Jun', productivity: 88, focus: 90, goals: 90 },
]

const patterns = [
  {
    title: 'Peak Performance',
    description: 'Highest productivity consistently occurs between 9 AM and 11 AM',
    impact: 'high',
    trend: 'up',
    category: 'time'
  },
  {
    title: 'Focus Sessions',
    description: 'Longer focus sessions (>90 mins) lead to 30% higher output',
    impact: 'medium',
    trend: 'up',
    category: 'productivity'
  },
  {
    title: 'Meeting Impact',
    description: 'Back-to-back meetings reduce afternoon productivity by 25%',
    impact: 'high',
    trend: 'down',
    category: 'meetings'
  }
]

export function TrendAnalysis() {
  const [timeframe, setTimeframe] = useState('6m')
  const [metric, setMetric] = useState('all')

  return (
    <div className="space-y-6">
      {/* Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Long-term Trends</CardTitle>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="focus">Focus Time</SelectItem>
                <SelectItem value="goals">Goal Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(metric === 'all' || metric === 'productivity') && (
                  <Area
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary)/.2)"
                    strokeWidth={2}
                  />
                )}
                {(metric === 'all' || metric === 'focus') && (
                  <Area
                    type="monotone"
                    dataKey="focus"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary)/.2)"
                    strokeWidth={2}
                  />
                )}
                {(metric === 'all' || metric === 'goals') && (
                  <Area
                    type="monotone"
                    dataKey="goals"
                    stroke="hsl(var(--muted))"
                    fill="hsl(var(--muted)/.2)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Recognition */}
      <Card>
        <CardHeader>
          <CardTitle>Identified Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pattern.title}</span>
                        <Badge variant={pattern.impact === 'high' ? 'destructive' : 'secondary'}>
                          {pattern.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pattern.description}
                      </p>
                    </div>
                    {pattern.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonality Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="focus"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 