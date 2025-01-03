'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

const completionData = [
  { day: 'Mon', tasks: 85, goals: 60 },
  { day: 'Tue', tasks: 70, goals: 65 },
  { day: 'Wed', tasks: 90, goals: 75 },
  { day: 'Thu', tasks: 65, goals: 80 },
  { day: 'Fri', tasks: 75, goals: 85 },
  { day: 'Sat', tasks: 80, goals: 90 },
  { day: 'Sun', tasks: 95, goals: 95 },
]

const categoryData = [
  { name: 'Work', completed: 24, total: 30 },
  { name: 'Personal', completed: 18, total: 20 },
  { name: 'Health', completed: 12, total: 15 },
  { name: 'Learning', completed: 8, total: 10 },
]

const habitData = [
  { name: 'Morning Routine', streak: 15, adherence: 90 },
  { name: 'Exercise', streak: 7, adherence: 75 },
  { name: 'Reading', streak: 21, adherence: 85 },
  { name: 'Meditation', streak: 30, adherence: 95 },
]

export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <Progress value={85} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goals Progress</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress value={72} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
                <p className="text-2xl font-bold">8.5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Progress value={85} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Tracked</p>
                <p className="text-2xl font-bold">32h</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <Progress value={75} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="completion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completion">Completion Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
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
                      dataKey="goals"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" />
                    <Bar dataKey="total" fill="hsl(var(--muted))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habitData.map((habit) => (
              <Card key={habit.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {habit.streak} day streak
                      </p>
                    </div>
                    <Badge variant="secondary">{habit.adherence}%</Badge>
                  </div>
                  <Progress value={habit.adherence} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 