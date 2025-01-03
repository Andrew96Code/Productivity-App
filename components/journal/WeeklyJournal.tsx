'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format, startOfWeek, endOfWeek } from 'date-fns'

const reflectionQuestions = [
  "What were your biggest accomplishments this week?",
  "What challenges did you face and how did you overcome them?",
  "What progress did you make towards your long-term goals?",
  "What did you learn this week?",
  "What are your top priorities for next week?"
]

export function WeeklyJournal() {
  const [selectedWeek] = useState(new Date())
  const [responses, setResponses] = useState<Record<string, string>>(
    reflectionQuestions.reduce((acc, q) => ({ ...acc, [q]: '' }), {})
  )

  const weekStart = startOfWeek(selectedWeek)
  const weekEnd = endOfWeek(selectedWeek)

  const handleResponseChange = (question: string, value: string) => {
    setResponses(prev => ({ ...prev, [question]: value }))
  }

  const handleSave = () => {
    console.log({ weekStart, weekEnd, responses })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reflectionQuestions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label>{question}</Label>
              <Textarea
                value={responses[question]}
                onChange={(e) => handleResponseChange(question, e.target.value)}
                placeholder="Write your response..."
                className="min-h-[100px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Week's Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Top Priorities</Label>
            <Textarea
              placeholder="List your top priorities for next week..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Focus Areas</Label>
            <Textarea
              placeholder="What areas will you focus on improving?"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Weekly Reflection</Button>
      </div>
    </div>
  )
} 