'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { Progress } from '@/components/ui/progress'

const monthlyPrompts = [
  {
    category: "Achievements",
    questions: [
      "What were your biggest achievements this month?",
      "Which goals did you accomplish?",
      "What are you most proud of?"
    ]
  },
  {
    category: "Growth & Learning",
    questions: [
      "How have you grown personally and professionally?",
      "What new skills or knowledge did you acquire?",
      "What valuable lessons did you learn?"
    ]
  },
  {
    category: "Challenges & Solutions",
    questions: [
      "What significant challenges did you face?",
      "How did you overcome these obstacles?",
      "What would you do differently next time?"
    ]
  },
  {
    category: "Next Month Planning",
    questions: [
      "What are your top priorities for next month?",
      "Which habits would you like to develop or change?",
      "What specific actions will you take to achieve your goals?"
    ]
  }
]

export function MonthlyJournal() {
  const [selectedMonth] = useState(new Date())
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [goals, setGoals] = useState([
    { title: 'Complete Project X', progress: 75 },
    { title: 'Learn New Technology', progress: 60 },
    { title: 'Improve Health Habits', progress: 90 },
  ])

  const monthStart = startOfMonth(selectedMonth)
  const monthEnd = endOfMonth(selectedMonth)

  const handleResponseChange = (question: string, value: string) => {
    setResponses(prev => ({ ...prev, [question]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Review: {format(monthStart, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {monthlyPrompts.map((section) => (
              <div key={section.category} className="space-y-4">
                <h3 className="font-semibold text-lg">{section.category}</h3>
                {section.questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label>{question}</Label>
                    <Textarea
                      value={responses[question] || ''}
                      onChange={(e) => handleResponseChange(question, e.target.value)}
                      placeholder="Write your response..."
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{goal.title}</Label>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => console.log({ responses, goals })}>
          Save Monthly Review
        </Button>
      </div>
    </div>
  )
} 