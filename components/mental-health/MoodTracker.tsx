'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Moon, Activity } from 'lucide-react'

interface MoodEntry {
  id: string
  date: Date
  mood: number
  energy: number
  notes: string
  factors: string[]
}

const moodData = [
  { day: 'Mon', mood: 8, energy: 7 },
  { day: 'Tue', mood: 6, energy: 5 },
  { day: 'Wed', mood: 7, energy: 8 },
  { day: 'Thu', mood: 9, energy: 8 },
  { day: 'Fri', mood: 7, energy: 6 },
  { day: 'Sat', mood: 8, energy: 7 },
  { day: 'Sun', mood: 8, energy: 9 },
]

const moodFactors = [
  'Sleep', 'Exercise', 'Work', 'Social', 'Weather', 'Health', 'Stress'
]

export function MoodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMood, setCurrentMood] = useState(7)
  const [currentEnergy, setCurrentEnergy] = useState(7)
  const [notes, setNotes] = useState('')
  const [selectedFactors, setSelectedFactors] = useState<string[]>([])

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="h-6 w-6 text-green-500" />
    if (mood >= 4) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Frown className="h-6 w-6 text-red-500" />
  }

  const getEnergyIcon = (energy: number) => {
    if (energy >= 7) return <Sun className="h-6 w-6 text-yellow-500" />
    if (energy >= 4) return <Cloud className="h-6 w-6 text-blue-500" />
    return <Moon className="h-6 w-6 text-purple-500" />
  }

  return (
    <div className="space-y-6">
      {/* Current Mood Input */}
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mood</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(Number(e.target.value))}
                    className="flex-1"
                  />
                  {getMoodIcon(currentMood)}
                  <span className="font-bold">{currentMood}/10</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Energy</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEnergy}
                    onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                    className="flex-1"
                  />
                  {getEnergyIcon(currentEnergy)}
                  <span className="font-bold">{currentEnergy}/10</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Contributing Factors</label>
                <div className="flex flex-wrap gap-2">
                  {moodFactors.map((factor) => (
                    <Badge
                      key={factor}
                      variant={selectedFactors.includes(factor) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedFactors(prev =>
                          prev.includes(factor)
                            ? prev.filter(f => f !== factor)
                            : [...prev, factor]
                        )
                      }}
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your mood..."
                className="h-[150px]"
              />
              <Button className="w-full">Save Entry</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Mood & Energy Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Mood"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Energy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    </div>
  )
} 