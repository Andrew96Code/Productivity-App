'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

type Level = {
  current: number
  xp: number
  nextLevelXp: number
}

export function GamificationSystem() {
  const [level, setLevel] = useState<Level>({ current: 1, xp: 0, nextLevelXp: 100 })
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    // In a real app, fetch this data from your API
    const dummyAchievements: Achievement[] = [
      { id: '1', name: 'Early Bird', description: 'Complete 5 tasks before 9 AM', icon: '🌅', unlocked: true },
      { id: '2', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: true },
      { id: '3', name: 'Productivity Guru', description: 'Achieve 100% productivity for a week', icon: '🧘', unlocked: false },
      { id: '4', name: 'Task Terminator', description: 'Complete 1000 tasks', icon: '💪', unlocked: false },
      { id: '5', name: 'Journaling Jedi', description: 'Write in your journal for 30 consecutive days', icon: '✍️', unlocked: false },
    ]
    setAchievements(dummyAchievements)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Level {level.current}</h3>
          <Progress value={(level.xp / level.nextLevelXp) * 100} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">
            {level.xp} / {level.nextLevelXp} XP to next level
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Achievements</h3>
          <ScrollArea className="h-[200px]">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                  {achievement.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

