'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function JournalStreak() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={70} />
          <p className="text-sm text-muted-foreground">7 days streak</p>
        </div>
      </CardContent>
    </Card>
  )
} 