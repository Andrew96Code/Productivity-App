'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export function MentalHealthWellness() {
  const [moodScore, setMoodScore] = useState(5)
  const [journalEntry, setJournalEntry] = useState('')
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([])
  const [newGratitudeItem, setNewGratitudeItem] = useState('')

  const addGratitudeItem = () => {
    if (newGratitudeItem.trim()) {
      setGratitudeItems([...gratitudeItems, newGratitudeItem.trim()])
      setNewGratitudeItem('')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mental Health & Wellness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="mood-tracker">Mood Tracker</Label>
          <Slider
            id="mood-tracker"
            min={1}
            max={10}
            step={1}
            value={[moodScore]}
            onValueChange={(value) => setMoodScore(value[0])}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">Current mood: {moodScore}/10</p>
        </div>

        <div>
          <Label htmlFor="journal-entry">Reflective Journaling</Label>
          <Textarea
            id="journal-entry"
            placeholder="Write your thoughts here..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>

        <div>
          <Label>Gratitude Practice</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              placeholder="I'm grateful for..."
              value={newGratitudeItem}
              onChange={(e) => setNewGratitudeItem(e.target.value)}
            />
            <Button onClick={addGratitudeItem}>Add</Button>
          </div>
          <ul className="list-disc list-inside mt-2">
            {gratitudeItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <Button className="w-full">Get Wellness Insights</Button>
      </CardContent>
    </Card>
  )
}

