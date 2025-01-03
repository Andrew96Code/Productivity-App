'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw } from 'lucide-react'

type Meditation = {
  id: string
  title: string
  description: string
  duration: number
  audioSrc: string
}

const meditations: Meditation[] = [
  {
    id: '1',
    title: 'Mindful Breathing',
    description: 'A short meditation focusing on your breath to center yourself.',
    duration: 300, // 5 minutes
    audioSrc: '/meditations/mindful-breathing.mp3'
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'A relaxing meditation to release tension throughout your body.',
    duration: 600, // 10 minutes
    audioSrc: '/meditations/body-scan.mp3'
  },
  {
    id: '3',
    title: 'Loving-Kindness',
    description: 'Cultivate compassion for yourself and others with this meditation.',
    duration: 900, // 15 minutes
    audioSrc: '/meditations/loving-kindness.mp3'
  }
]

export function GuidedMeditation() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (selectedMeditation) {
      audioRef.current = new Audio(selectedMeditation.audioSrc)
      audioRef.current.addEventListener('timeupdate', updateProgress)
      audioRef.current.addEventListener('ended', handleEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress)
        audioRef.current.removeEventListener('ended', handleEnded)
      }
    }
  }, [selectedMeditation])

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guided Meditation</CardTitle>
        <CardDescription>Center yourself with a short mindfulness exercise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedMeditation?.id || ''}
          onValueChange={(value) => setSelectedMeditation(meditations.find(m => m.id === value) || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a meditation" />
          </SelectTrigger>
          <SelectContent>
            {meditations.map((meditation) => (
              <SelectItem key={meditation.id} value={meditation.id}>
                {meditation.title} ({formatTime(meditation.duration)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMeditation && (
          <div className="space-y-4">
            <p>{selectedMeditation.description}</p>
            <div className="flex items-center justify-between">
              <Button onClick={togglePlayPause}>
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={selectedMeditation.duration}
                step={1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-between text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(selectedMeditation.duration)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

