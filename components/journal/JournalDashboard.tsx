'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CalendarDays, TrendingUp, BookOpen, Star } from 'lucide-react'

export function JournalDashboard() {
  const stats = {
    streak: 7,
    totalEntries: 42,
    monthlyEntries: 12,
    averageMood: 7.5
  }

  const recentTags = ['Gratitude', 'Work', 'Personal', 'Goals', 'Learning']

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Stats Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stats.streak} Days</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stats.monthlyEntries}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stats.averageMood}/10</p>
              <p className="text-xs text-muted-foreground">Average Mood</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">12/30 entries</span>
              <span className="text-muted-foreground">40%</span>
            </div>
            <Progress value={40} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 