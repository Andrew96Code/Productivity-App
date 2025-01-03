'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

interface Subcategory {
  name: string
  rating: number
  notes: string
}

interface HighPerformanceHabit {
  category: string
  subcategories: Subcategory[]
}

const defaultHabits: HighPerformanceHabit[] = [
  {
    category: 'Clarity',
    subcategories: [
      { name: 'Mental Clarity', rating: 5, notes: '' },
      { name: 'Goal Clarity', rating: 5, notes: '' },
      { name: 'Priority Clarity', rating: 5, notes: '' },
    ]
  },
  {
    category: 'Energy',
    subcategories: [
      { name: 'Physical Energy', rating: 5, notes: '' },
      { name: 'Mental Energy', rating: 5, notes: '' },
      { name: 'Emotional Energy', rating: 5, notes: '' },
    ]
  },
  {
    category: 'Productivity',
    subcategories: [
      { name: 'Focus', rating: 5, notes: '' },
      { name: 'Time Management', rating: 5, notes: '' },
      { name: 'Task Completion', rating: 5, notes: '' },
    ]
  }
]

interface RatingSection {
  label: string
  value: number
  setValue: (value: number) => void
  notes: string
  setNotes: (notes: string) => void
  prompt: string
}

export function DailyJournal() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [mood, setMood] = useState(5)
  const [moodNotes, setMoodNotes] = useState('')
  const [energy, setEnergy] = useState(5)
  const [energyNotes, setEnergyNotes] = useState('')
  const [entry, setEntry] = useState('')
  const [habits, setHabits] = useState<HighPerformanceHabit[]>(defaultHabits)
  const [habitNotes, setHabitNotes] = useState<Record<string, string>>({})

  const updateHabitRating = (habitIndex: number, subIndex: number, newRating: number) => {
    setHabits(currentHabits => {
      const newHabits = [...currentHabits]
      newHabits[habitIndex].subcategories[subIndex].rating = newRating
      return newHabits
    })
  }

  const handleSave = () => {
    console.log({
      date: selectedDate,
      mood,
      energy,
      entry,
      habits
    })
  }

  const renderScoreLabels = () => (
    <div className="flex justify-between text-xs text-muted-foreground">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <span key={num}>{num}</span>
      ))}
    </div>
  )

  const RatingWithNotes = ({ label, value, setValue, notes, setNotes, prompt }: RatingSection) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => setValue(v)}
        max={10}
        min={1}
        step={1}
        className="mb-1"
      />
      {renderScoreLabels()}
      <div className="mt-2">
        <Label className="text-sm text-muted-foreground">{prompt}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes here..."
          className="mt-1 min-h-[80px]"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-6">
            <RatingWithNotes
              label="Mood"
              value={mood}
              setValue={setMood}
              notes={moodNotes}
              setNotes={setMoodNotes}
              prompt="What factors influenced your mood today?"
            />
            <RatingWithNotes
              label="Energy"
              value={energy}
              setValue={setEnergy}
              notes={energyNotes}
              setNotes={setEnergyNotes}
              prompt="What affected your energy levels today?"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <Label>Daily Reflection</Label>
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your thoughts..."
            className="mt-2 min-h-[200px]"
          />
        </CardContent>
      </Card>

      {habits.map((habit, habitIndex) => (
        <Card key={habit.category}>
          <CardContent className="p-4">
            <Label className="text-lg font-semibold">{habit.category}</Label>
            <div className="space-y-6 mt-4">
              {habit.subcategories.map((sub, subIndex) => (
                <div key={sub.name} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{sub.name}</Label>
                    <span className="text-sm text-muted-foreground">{sub.rating}/10</span>
                  </div>
                  <Slider
                    value={[sub.rating]}
                    onValueChange={([value]) => updateHabitRating(habitIndex, subIndex, value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-1"
                  />
                  {renderScoreLabels()}
                  <div className="mt-2">
                    <Label className="text-sm text-muted-foreground">
                      What influenced your {sub.name.toLowerCase()} today?
                    </Label>
                    <Textarea
                      value={habitNotes[`${habit.category}-${sub.name}`] || ''}
                      onChange={(e) => {
                        setHabitNotes(prev => ({
                          ...prev,
                          [`${habit.category}-${sub.name}`]: e.target.value
                        }))
                      }}
                      placeholder="Add your notes here..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Entry</Button>
      </div>
    </div>
  )
} 