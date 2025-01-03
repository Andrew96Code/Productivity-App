'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, Heart, Smile, Activity, ArrowRight, Calendar } from 'lucide-react'

const moodData = [
  { date: 'Mon', mood: 7, energy: 6, sleep: 7 },
  { date: 'Tue', mood: 6, energy: 7, sleep: 8 },
  { date: 'Wed', mood: 8, energy: 8, sleep: 7 },
  { date: 'Thu', mood: 7, energy: 6, sleep: 6 },
  { date: 'Fri', mood: 8, energy: 7, sleep: 8 },
  { date: 'Sat', mood: 9, energy: 8, sleep: 8 },
  { date: 'Sun', mood: 8, energy: 7, sleep: 7 },
]

const wellnessStats = [
  {
    title: 'Mood Score',
    value: '8.2',
    change: '+0.5',
    trend: 'up',
    icon: Smile,
    color: 'text-yellow-500'
  },
  {
    title: 'Energy Level',
    value: '7.5',
    change: '+0.3',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-500'
  },
  {
    title: 'Sleep Quality',
    value: '7.8',
    change: '+0.2',
    trend: 'up',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    title: 'Mindfulness',
    value: '6.5',
    change: '+1.0',
    trend: 'up',
    icon: Brain,
    color: 'text-purple-500'
  }
]

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Wellness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {wellnessStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 bg-primary/10 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-2">vs last week</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mood Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Wellness Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Mood"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="hsl(var(--muted))"
                  strokeWidth={2}
                  name="Sleep"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Meditation Session</h3>
                <p className="text-sm text-muted-foreground">5-minute mindfulness</p>
              </div>
            </div>
            <Button className="w-full">Start Now</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Journal Entry</h3>
                <p className="text-sm text-muted-foreground">Record your thoughts</p>
              </div>
            </div>
            <Button className="w-full">Write Now</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Heart className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Coping Tools</h3>
                <p className="text-sm text-muted-foreground">Stress relief exercises</p>
              </div>
            </div>
            <Button className="w-full">Explore</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Morning Meditation', time: '9:00 AM', type: 'Mindfulness' },
              { title: 'Mood Check-in', time: '2:30 PM', type: 'Tracking' },
              { title: 'Breathing Exercise', time: '5:45 PM', type: 'Exercise' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <Brain className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary">{activity.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 