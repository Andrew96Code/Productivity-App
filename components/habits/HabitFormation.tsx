'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Plus, Clock, Target, Sparkles, ArrowRight } from 'lucide-react'

interface Habit {
  id: string
  name: string
  category: string
  frequency: string
  timeOfDay: string
  difficulty: 'easy' | 'medium' | 'hard'
  trigger: string
  reward: string
  progress: number
  aiSuggestions: {
    improvement: string
    stack: string[]
    reminder: string
  }
}

const habits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'Mindfulness',
    frequency: 'Daily',
    timeOfDay: 'Morning',
    difficulty: 'medium',
    trigger: 'After making bed',
    reward: '10 minutes of peaceful reflection',
    progress: 75,
    aiSuggestions: {
      improvement: 'Try starting with 2-minute sessions to build consistency',
      stack: ['Breathing exercises', 'Gratitude journaling'],
      reminder: 'Place meditation cushion next to bed as a visual cue'
    }
  },
  {
    id: '2',
    name: 'Reading',
    category: 'Learning',
    frequency: 'Daily',
    timeOfDay: 'Evening',
    difficulty: 'easy',
    trigger: 'After dinner',
    reward: 'Track books completed',
    progress: 45,
    aiSuggestions: {
      improvement: 'Set a specific page goal rather than time-based goal',
      stack: ['Note-taking', 'Book summaries'],
      reminder: 'Keep current book on nightstand'
    }
  }
]

export function HabitFormation() {
  const [searchQuery, setSearchQuery] = useState('')

  const getDifficultyColor = (difficulty: Habit['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-background">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-purple-500/10">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Habit Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Get personalized suggestions for habit formation
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Describe a habit you want to build..."
              className="w-full"
            />
            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Habit Creation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Habits in Formation</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card key={habit.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{habit.timeOfDay}</span>
                        <span>•</span>
                        <span>{habit.frequency}</span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(habit.difficulty)}>
                      {habit.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Formation Progress</span>
                        <span>{habit.progress}%</span>
                      </div>
                      <Progress value={habit.progress} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Habit Stack</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Trigger: {habit.trigger}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Reward: {habit.reward}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">AI Suggestions</p>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            {habit.aiSuggestions.improvement}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {habit.aiSuggestions.stack.map((suggestion, index) => (
                              <Badge key={index} variant="secondary">
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 