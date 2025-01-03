'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const prompts = [
  "What are three things you're grateful for today?",
  "What's a challenge you faced recently and how did you overcome it?",
  "What's something you learned about yourself this week?",
  "What are your goals for the next month?",
  "Describe a moment that made you smile today.",
  "What's something you'd like to improve about yourself?"
]

export function ReflectionPrompts() {
  return (
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="flex-1">{prompt}</p>
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 