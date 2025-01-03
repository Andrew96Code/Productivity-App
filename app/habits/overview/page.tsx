'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, Calendar, Star, TrendingUp } from 'lucide-react'

export default function HabitOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Habits
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Streaks
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={87} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Days Tracked
                </p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-auto py-4" variant="outline">
          <div className="flex flex-col items-center">
            <Target className="h-6 w-6 mb-2" />
            <span>Create New Habit</span>
          </div>
        </Button>
        <Button className="h-auto py-4" variant="outline">
          <div className="flex flex-col items-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>View Tracker</span>
          </div>
        </Button>
        <Button className="h-auto py-4" variant="outline">
          <div className="flex flex-col items-center">
            <Star className="h-6 w-6 mb-2" />
            <span>Join Challenge</span>
          </div>
        </Button>
      </div>
    </div>
  )
} 