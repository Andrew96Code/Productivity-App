'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Medal, Target, Flame, Star, ArrowUp, ArrowDown } from 'lucide-react'

interface LeaderboardUser {
  id: string
  rank: number
  name: string
  avatar: string
  points: number
  level: number
  achievements: number
  streak: number
  change: 'up' | 'down' | 'none'
  badges: {
    name: string
    color: string
  }[]
  stats: {
    tasksCompleted: number
    goalsAchieved: number
    challengesWon: number
  }
}

const leaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    points: 15420,
    level: 42,
    achievements: 28,
    streak: 45,
    change: 'none',
    badges: [
      { name: 'Productivity Master', color: 'bg-purple-500' },
      { name: 'Goal Crusher', color: 'bg-blue-500' },
      { name: 'Challenge Champion', color: 'bg-green-500' }
    ],
    stats: {
      tasksCompleted: 342,
      goalsAchieved: 24,
      challengesWon: 12
    }
  },
  {
    id: '2',
    rank: 2,
    name: 'Alex Thompson',
    avatar: '/avatars/alex.jpg',
    points: 14850,
    level: 38,
    achievements: 25,
    streak: 32,
    change: 'up',
    badges: [
      { name: 'Focus Expert', color: 'bg-yellow-500' },
      { name: 'Team Leader', color: 'bg-red-500' }
    ],
    stats: {
      tasksCompleted: 289,
      goalsAchieved: 18,
      challengesWon: 8
    }
  }
]

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly')
  const [category, setCategory] = useState('all')

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <Card key={user.id} className={cn(
            "relative overflow-hidden",
            index === 0 ? "bg-gradient-to-b from-yellow-500/10 to-background" :
            index === 1 ? "bg-gradient-to-b from-gray-500/10 to-background" :
            "bg-gradient-to-b from-orange-500/10 to-background"
          )}>
            <div className="absolute top-2 right-2">
              {index === 0 ? (
                <Trophy className="h-6 w-6 text-yellow-500" />
              ) : index === 1 ? (
                <Medal className="h-6 w-6 text-gray-400" />
              ) : (
                <Medal className="h-6 w-6 text-orange-500" />
              )}
            </div>
            <CardContent className="pt-8 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">Level {user.level}</p>
              <div className="flex justify-center gap-2 mb-4">
                {user.badges.map((badge, i) => (
                  <Badge key={i} className={badge.color}>
                    {badge.name}
                  </Badge>
                ))}
              </div>
              <div className="text-2xl font-bold mb-2">{user.points.toLocaleString()} pts</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Tasks</div>
                  <div>{user.stats.tasksCompleted}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Goals</div>
                  <div>{user.stats.goalsAchieved}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Wins</div>
                  <div>{user.stats.challengesWon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leaderboard</CardTitle>
            <div className="flex gap-2">
              <select
                className="p-2 rounded-md border"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="allTime">All Time</option>
              </select>
              <select
                className="p-2 rounded-md border"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="tasks">Tasks</option>
                <option value="goals">Goals</option>
                <option value="challenges">Challenges</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold">{user.rank}</div>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {user.level} • {user.achievements} achievements
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{user.streak} day streak</span>
                  </div>
                  <div className="w-32 text-right">
                    <div className="font-bold">{user.points.toLocaleString()} pts</div>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      {user.change === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : user.change === 'down' ? (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      ) : null}
                      <span className={cn(
                        user.change === 'up' ? 'text-green-500' :
                        user.change === 'down' ? 'text-red-500' :
                        'text-muted-foreground'
                      )}>
                        {user.change !== 'none' && 'Changed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 