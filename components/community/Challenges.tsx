'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Users, Calendar, Target, ArrowRight, Star } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  participants: number
  progress?: number
  startDate: string
  endDate: string
  rewards: string[]
  joined: boolean
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: '30 Days of Deep Work',
    description: 'Build a consistent deep work practice with daily focused sessions.',
    category: 'Productivity',
    difficulty: 'intermediate',
    duration: '30 days',
    participants: 245,
    progress: 60,
    startDate: '2024-03-01',
    endDate: '2024-03-30',
    rewards: ['Deep Work Badge', '500 Points', 'Productivity Certificate'],
    joined: true
  },
  {
    id: '2',
    title: 'Morning Routine Challenge',
    description: 'Establish a powerful morning routine to boost daily productivity.',
    category: 'Habits',
    difficulty: 'beginner',
    duration: '21 days',
    participants: 189,
    startDate: '2024-03-15',
    endDate: '2024-04-04',
    rewards: ['Early Bird Badge', '300 Points'],
    joined: false
  },
  {
    id: '3',
    title: 'Goal Achievement Sprint',
    description: 'Set and achieve three significant goals in one month.',
    category: 'Goals',
    difficulty: 'advanced',
    duration: '30 days',
    participants: 156,
    startDate: '2024-03-10',
    endDate: '2024-04-08',
    rewards: ['Goal Master Badge', '1000 Points', 'Achievement Certificate'],
    joined: false
  }
]

export function Challenges() {
  const [activeChallenges, setActiveChallenges] = useState(challenges)

  const toggleJoin = (challengeId: string) => {
    setActiveChallenges(challenges => challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return { ...challenge, joined: !challenge.joined }
      }
      return challenge
    }))
  }

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Featured Challenge */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Featured Challenge</h2>
              <p className="text-muted-foreground">Join our most popular challenge</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">30 Days of Deep Work</h3>
              <p className="text-muted-foreground">
                Transform your productivity with dedicated deep work sessions.
                Master the art of focused work and achieve more in less time.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">245 Participants</Badge>
                <Badge variant="secondary">30 Days</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>60%</span>
                </div>
                <Progress value={60} />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Avatar key={i} className="w-8 h-8">
                    <AvatarImage src={`/avatars/user${i + 1}.jpg`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                  +242
                </div>
              </div>
              <Button className="w-full">Join Challenge</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge List */}
      <div className="grid md:grid-cols-2 gap-6">
        {activeChallenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{challenge.participants} joined</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{challenge.duration}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {challenge.rewards.map((reward, index) => (
                    <Badge key={index} variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {reward}
                    </Badge>
                  ))}
                </div>

                {challenge.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant={challenge.joined ? "outline" : "default"}
                  onClick={() => toggleJoin(challenge.id)}
                >
                  {challenge.joined ? 'Leave Challenge' : 'Join Challenge'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 