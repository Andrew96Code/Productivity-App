'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapMenu } from './TipTapMenu'
import { Slider } from '@/components/ui/slider'

const highPerformanceHabits = {
  Clarity: ['Mental Clarity', 'Goal Clarity', 'Priority Clarity'],
  Energy: ['Physical Energy', 'Emotional Energy', 'Mental Energy'],
  Necessity: ['Sense of Urgency', 'Importance of Tasks', 'Alignment with Goals'],
  Productivity: ['Task Completion', 'Efficiency', 'Time Management'],
  Influence: ['Communication', 'Leadership', 'Networking'],
  Courage: ['Facing Challenges', 'Taking Risks', 'Speaking Up']
}

export function DailyJournal() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [habitScores, setHabitScores] = useState(
    Object.fromEntries(
      Object.entries(highPerformanceHabits).flatMap(([habit, subtopics]) =>
        subtopics.map(subtopic => [`${habit}-${subtopic}`, 5])
      )
    )
  )
  const [habitNotes, setHabitNotes] = useState(
    Object.fromEntries(
      Object.entries(highPerformanceHabits).flatMap(([habit, subtopics]) =>
        subtopics.map(subtopic => [`${habit}-${subtopic}`, ''])
      )
    )
  )
  const [overallScore, setOverallScore] = useState(5)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your journal entry here...</p>',
  })

  const handleSave = () => {
    if (editor) {
      const journalEntry = editor.getHTML()
      console.log('Saving journal entry:', { date, habitScores, habitNotes, overallScore, journalEntry })
      // Implement save functionality here
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Journal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="journal-entry">Journal Entry</Label>
          <TipTapMenu editor={editor} />
          <div className="border rounded-md p-2 min-h-[300px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        {Object.entries(highPerformanceHabits).map(([habit, subtopics]) => (
          <div key={habit} className="space-y-4">
            <h3 className="text-lg font-semibold">{habit}</h3>
            {subtopics.map((subtopic) => (
              <div key={`${habit}-${subtopic}`} className="space-y-2">
                <Label htmlFor={`${habit}-${subtopic}`}>{subtopic}</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id={`${habit}-${subtopic}`}
                    min={1}
                    max={10}
                    step={1}
                    value={[habitScores[`${habit}-${subtopic}`]]}
                    onValueChange={(value) => setHabitScores(prev => ({ ...prev, [`${habit}-${subtopic}`]: value[0] }))}
                    className="flex-grow"
                  />
                  <span className="w-8 text-center">{habitScores[`${habit}-${subtopic}`]}/10</span>
                </div>
                <Textarea
                  placeholder={`Notes on ${subtopic}...`}
                  value={habitNotes[`${habit}-${subtopic}`]}
                  onChange={(e) => setHabitNotes(prev => ({ ...prev, [`${habit}-${subtopic}`]: e.target.value }))}
                  rows={3}
                />
              </div>
            ))}
          </div>
        ))}

        <div>
          <Label htmlFor="overall-score">Overall Score</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="overall-score"
              min={1}
              max={10}
              step={1}
              value={[overallScore]}
              onValueChange={(value) => setOverallScore(value[0])}
              className="flex-grow"
            />
            <span className="w-8 text-center">{overallScore}/10</span>
          </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Entry</Button>
      </CardFooter>
    </Card>
  )
}

