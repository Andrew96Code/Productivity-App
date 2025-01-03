'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'

type PomodoroTimerProps = {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
}

export function PomodoroTimer({ isRunning, onStart, onStop }: PomodoroTimerProps) {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            onStop()
            return 25 * 60
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, onStop])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTime(25 * 60)
    onStop()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-4">{formatTime(time)}</div>
        <div className="flex space-x-2">
          <Button onClick={isRunning ? onStop : onStart}>
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

