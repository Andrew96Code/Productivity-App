'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Brain, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Suggestion {
  id: string
  type: 'task' | 'schedule' | 'habit' | 'productivity'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  timeEstimate?: string
  category?: string
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    type: 'task',
    title: 'Break down project milestones',
    description: 'Your current project could benefit from smaller, manageable tasks.',
    impact: 'high',
    timeEstimate: '30 mins',
    category: 'Planning'
  },
  {
    id: '2',
    type: 'schedule',
    title: 'Schedule deep work block',
    description: 'Your most productive hours are between 9 AM and 11 AM.',
    impact: 'high',
    timeEstimate: '2 hours',
    category: 'Productivity'
  },
  {
    id: '3',
    type: 'habit',
    title: 'Add a morning review routine',
    description: 'Start your day with a 10-minute planning session.',
    impact: 'medium',
    timeEstimate: '10 mins',
    category: 'Habits'
  }
]

export function AITaskSuggestions() {
  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'task':
        return <Clock className="h-4 w-4" />
      case 'schedule':
        return <Brain className="h-4 w-4" />
      case 'habit':
        return <Sparkles className="h-4 w-4" />
      case 'productivity':
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: Suggestion['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="min-w-[280px] flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(suggestion.type)}
                  <p className="font-medium truncate">{suggestion.title}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("capitalize", getImpactColor(suggestion.impact))}
                  >
                    {suggestion.impact} impact
                  </Badge>
                  {suggestion.timeEstimate && (
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      {suggestion.timeEstimate}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 