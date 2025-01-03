'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Suggestion = {
  id: string
  text: string
}

type AISuggestionsProps = {
  type: 'goals' | 'habits'
}

export function AISuggestions({ type }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    // In a real app, this would call an AI service to generate suggestions
    const fetchSuggestions = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newSuggestions: Suggestion[] = [
        { id: '1', text: type === 'goals' ? 'Read 12 books this year' : 'Read for 30 minutes every day' },
        { id: '2', text: type === 'goals' ? 'Learn a new language' : 'Practice language learning for 15 minutes daily' },
        { id: '3', text: type === 'goals' ? 'Run a marathon' : 'Go for a 20-minute run 3 times a week' },
      ]
      setSuggestions(newSuggestions)
    }
    fetchSuggestions()
  }, [type])

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Suggested {type === 'goals' ? 'Goals' : 'Habits'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {suggestions.map(suggestion => (
            <li key={suggestion.id} className="flex justify-between items-center">
              <span>{suggestion.text}</span>
              <Button variant="outline" size="sm">Add</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

