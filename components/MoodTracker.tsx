'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const moodData = [
  { date: 'Mon', mood: 8 },
  { date: 'Tue', mood: 6 },
  { date: 'Wed', mood: 7 },
  { date: 'Thu', mood: 9 },
  { date: 'Fri', mood: 7 },
  { date: 'Sat', mood: 8 },
  { date: 'Sun', mood: 9 },
]

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊']

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Today's Mood</Label>
        <div className="flex justify-between mt-2">
          {moodEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant={selectedMood === index ? "default" : "outline"}
              className="text-2xl h-12 w-12"
              onClick={() => setSelectedMood(index)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Label className="text-base">Mood History</Label>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 