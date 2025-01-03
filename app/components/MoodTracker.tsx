'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type MoodEntry = {
  date: string
  mood: number
  note: string
}

export function MoodTracker({ fullView = false }: { fullView?: boolean }) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMood, setCurrentMood] = useState(5)
  const [note, setNote] = useState('')

  useEffect(() => {
    // In a real app, fetch this data from an API or local storage
    const dummyData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 10) + 1,
      note: ''
    }))
    setMoodEntries(dummyData)
  }, [])

  const addMoodEntry = () => {
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      note
    }
    setMoodEntries([newEntry, ...moodEntries])
    setCurrentMood(5)
    setNote('')
  }

  return (
    <Card className={fullView ? 'w-full' : ''}>
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>How are you feeling today?</Label>
            <Slider
              value={[currentMood]}
              onValueChange={(value) => setCurrentMood(value[0])}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-sm">
              <span>😢</span>
              <span>😐</span>
              <span>😊</span>
            </div>
          </div>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Add a note about your mood (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button onClick={addMoodEntry}>Log Mood</Button>
        </div>
        {fullView && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Mood History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

