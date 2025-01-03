'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SkipBack, SkipForward, Volume2, Timer } from 'lucide-react'

interface Meditation {
  id: string
  title: string
  description: string
  duration: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  imageUrl: string
  audioUrl: string
  completions: number
}

const meditations: Meditation[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    description: 'Start your day with clarity and purpose through this guided morning meditation.',
    duration: 600, // 10 minutes in seconds
    category: 'Focus',
    level: 'beginner',
    imageUrl: '/meditations/morning.jpg',
    audioUrl: '/meditations/morning.mp3',
    completions: 0
  },
  {
    id: '2',
    title: 'Deep Work Focus',
    description: 'Enhance your concentration and enter a state of flow with this meditation.',
    duration: 900, // 15 minutes
    category: 'Productivity',
    level: 'intermediate',
    imageUrl: '/meditations/focus.jpg',
    audioUrl: '/meditations/focus.mp3',
    completions: 0
  }
]

export function Meditation() {
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [remainingTime, setRemainingTime] = useState(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      {/* Featured Meditation */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Featured Session</h2>
              <h3 className="text-xl">Morning Mindfulness</h3>
              <p className="text-muted-foreground">
                Start your day with clarity and purpose through this guided morning meditation.
              </p>
              <div className="flex gap-2">
                <Badge>10 mins</Badge>
                <Badge variant="outline">Beginner</Badge>
              </div>
              <Button className="w-full" size="lg">
                Start Session
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden min-h-[200px] bg-gradient-to-br from-purple-500/20 to-background">
              {/* Meditation image would go here */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meditation Player */}
      <Card>
        <CardHeader>
          <CardTitle>Meditation Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Morning Mindfulness</h3>
                <p className="text-sm text-muted-foreground">10:00 remaining</p>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">10 min</span>
              </div>
            </div>

            <Progress value={30} />

            <div className="flex justify-center items-center gap-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-12 w-12">
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-[120px]"
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meditation Library */}
      <Card>
        <CardHeader>
          <CardTitle>Meditation Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {meditations.map((meditation) => (
              <Card key={meditation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium">{meditation.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {meditation.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {formatTime(meditation.duration)}
                        </Badge>
                        <Badge variant="outline">
                          {meditation.level}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 