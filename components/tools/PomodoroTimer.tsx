'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw, SkipForward, Bell } from 'lucide-react'

interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  })

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'work' | 'short-break' | 'long-break'>('work')
  const [completedSessions, setCompletedSessions] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handlePhaseComplete()
    }

    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const handlePhaseComplete = () => {
    if (currentPhase === 'work') {
      setCompletedSessions(prev => prev + 1)
      if (completedSessions + 1 >= settings.sessionsBeforeLongBreak) {
        setCurrentPhase('long-break')
        setTimeLeft(settings.longBreakDuration * 60)
        setCompletedSessions(0)
      } else {
        setCurrentPhase('short-break')
        setTimeLeft(settings.shortBreakDuration * 60)
      }
    } else {
      setCurrentPhase('work')
      setTimeLeft(settings.workDuration * 60)
    }
    
    playNotification()
  }

  const playNotification = () => {
    // Play sound and show notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${currentPhase === 'work' ? 'Break time!' : 'Time to focus!'}`
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge className="mb-4">{currentPhase.replace('-', ' ')}</Badge>
            <div className="text-6xl font-bold mb-6">{formatTime(timeLeft)}</div>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <><Pause className="mr-2" /> Pause</>
                ) : (
                  <><Play className="mr-2" /> Start</>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsRunning(false)
                  setTimeLeft(settings.workDuration * 60)
                  setCurrentPhase('work')
                }}
              >
                <RotateCcw className="mr-2" /> Reset
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePhaseComplete}
              >
                <SkipForward className="mr-2" /> Skip
              </Button>
            </div>
          </div>

          <Progress 
            value={(timeLeft / (settings.workDuration * 60)) * 100} 
          />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Session {completedSessions + 1} of {settings.sessionsBeforeLongBreak}
            </p>
            <p className="text-sm text-muted-foreground">
              {completedSessions * settings.workDuration} minutes focused today
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 