'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  category: 'Important & Urgent' | 'Important & Not Urgent' | 'Not Important & Urgent' | 'Not Important & Not Urgent'
}

type AITaskSuggestionsProps = {
  tasks: Task[]
  onAddTask: (task: Partial<Task>) => void
}

export function AITaskSuggestions({ tasks, onAddTask }: AITaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Partial<Task>[]>([])

  const generateSuggestions = () => {
    // In a real application, this would call an AI service
    // For this example, we'll generate some mock suggestions
    const mockSuggestions: Partial<Task>[] = [
      {
        title: "Review project deadlines",
        description: "Go through all ongoing projects and ensure deadlines are up to date",
        priority: "High",
        category: "Important & Urgent"
      },
      {
        title: "Plan team building activity",
        description: "Organize a virtual team building activity to boost morale",
        priority: "Medium",
        category: "Important & Not Urgent"
      },
      {
        title: "Update skills section in resume",
        description: "Add newly acquired skills to your resume",
        priority: "Low",
        category: "Not Important & Not Urgent"
      }
    ]
    setSuggestions(mockSuggestions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateSuggestions} className="mb-4">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Suggestions
        </Button>
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-4">
              <h4 className="font-semibold">{suggestion.title}</h4>
              <p className="text-sm text-gray-500">{suggestion.description}</p>
              <div className="mt-2">
                <Button onClick={() => onAddTask(suggestion)} size="sm">Add Task</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

