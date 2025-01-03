'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  progress: number
  duration: string
}

export function CommunityAndChallenges() {
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '30-Day Productivity Sprint',
      description: 'Boost your productivity for 30 days straight',
      participants: 1520,
      progress: 40,
      duration: '30 days'
    },
    { id: '2', title: 'Mindfulness Marathon', description: 'Practice mindfulness for 10 minutes daily', participants: 876, progress: 60, duration: '21 days' },
    { id: '3', title: 'Digital Detox Weekend', description: 'Minimize screen time for a full weekend', participants: 2341, progress: 0, duration: '2 days' },
  ])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader>
            <CardTitle>{challenge.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {challenge.description}
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={challenge.progress} className="mb-2" />
            <div className="flex justify-between text-sm">
              <span>{challenge.participants} participants</span>
              <span>{challenge.duration}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

