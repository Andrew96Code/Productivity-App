'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Heart, Lungs, Activity, Star, PlayCircle } from 'lucide-react'

interface CopingStrategy {
  id: string
  title: string
  description: string
  duration: string
  category: 'breathing' | 'relaxation' | 'mindfulness' | 'physical'
  difficulty: 'easy' | 'medium' | 'hard'
  steps: string[]
  benefits: string[]
  timesUsed: number
  rating: number
}

const strategies: CopingStrategy[] = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'A breathing technique to help reduce anxiety and promote relaxation.',
    duration: '5 minutes',
    category: 'breathing',
    difficulty: 'easy',
    steps: [
      'Find a comfortable position',
      'Inhale quietly through the nose for 4 seconds',
      'Hold breath for 7 seconds',
      'Exhale completely through mouth for 8 seconds',
      'Repeat cycle 4 times'
    ],
    benefits: [
      'Reduces anxiety',
      'Helps with sleep',
      'Manages stress',
      'Improves focus'
    ],
    timesUsed: 42,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax muscle groups to reduce physical tension.',
    duration: '15 minutes',
    category: 'relaxation',
    difficulty: 'medium',
    steps: [
      'Lie down in a comfortable position',
      'Start with your toes, tense for 5 seconds',
      'Release and notice the relaxation',
      'Move up through each muscle group',
      'End with facial muscles'
    ],
    benefits: [
      'Reduces physical tension',
      'Improves body awareness',
      'Helps with stress',
      'Better sleep quality'
    ],
    timesUsed: 28,
    rating: 4.6
  }
]

export function CopingTools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentStrategy, setCurrentStrategy] = useState<CopingStrategy | null>(null)

  const getCategoryIcon = (category: CopingStrategy['category']) => {
    switch (category) {
      case 'breathing':
        return <Lungs className="h-5 w-5" />
      case 'relaxation':
        return <Heart className="h-5 w-5" />
      case 'mindfulness':
        return <Brain className="h-5 w-5" />
      case 'physical':
        return <Activity className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Lungs className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Breathing Exercise</h3>
                <p className="text-sm text-muted-foreground">Quick calm in 2 minutes</p>
              </div>
            </div>
            <Button className="w-full">Start Now</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Grounding Exercise</h3>
                <p className="text-sm text-muted-foreground">5-4-3-2-1 technique</p>
              </div>
            </div>
            <Button className="w-full">Start Now</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-background">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Heart className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Relaxation</h3>
                <p className="text-sm text-muted-foreground">Instant stress relief</p>
              </div>
            </div>
            <Button className="w-full">Start Now</Button>
          </CardContent>
        </Card>
      </div>

      {/* Coping Strategies Library */}
      <Card>
        <CardHeader>
          <CardTitle>Coping Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {strategies.map((strategy) => (
                  <Card key={strategy.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(strategy.category)}
                            <h3 className="font-semibold">{strategy.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {strategy.description}
                          </p>
                        </div>
                        <Badge variant="outline">{strategy.duration}</Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{strategy.rating} rating</span>
                          <span className="text-sm text-muted-foreground">
                            ({strategy.timesUsed} uses)
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="secondary">{strategy.difficulty}</Badge>
                          <Badge variant="outline">{strategy.category}</Badge>
                        </div>

                        <Button className="w-full" onClick={() => setCurrentStrategy(strategy)}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Exercise
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* My Progress */}
      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal</span>
                <span>3/5 exercises</span>
              </div>
              <Progress value={60} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">
                    Exercises Completed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">4.7</div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">45m</div>
                  <div className="text-sm text-muted-foreground">
                    Time Invested
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">
                    Strategies Used
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 