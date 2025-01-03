'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Fire, Trophy, Star, Target, Calendar as CalendarIcon } from 'lucide-react'

export function HabitStreak() {
  return (
    <div className="space-y-6">
      {/* Streak Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Fire className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more streak stats here */}
      </div>
    </div>
  )
} 