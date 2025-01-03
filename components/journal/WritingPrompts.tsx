'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, RefreshCw } from 'lucide-react'

const promptCategories = {
  gratitude: [
    "What are three things you're grateful for today and why?",
    "Who has positively impacted your life recently?",
    "What simple pleasure brought you joy today?"
  ],
  reflection: [
    "What's been occupying your thoughts lately?",
    "How have you grown in the past month?",
    "What would your younger self think of you now?"
  ],
  goals: [
    "What's one step you can take today toward your goals?",
    "What's holding you back from achieving your dreams?",
    "How can you better align your actions with your values?"
  ],
  creativity: [
    "If you could master any skill instantly, what would it be?",
    "What would you do if you knew you couldn't fail?",
    "Describe your perfect day in detail."
  ]
}

export function WritingPrompts() {
  const [currentCategory, setCurrentCategory] = useState<keyof typeof promptCategories>('gratitude')
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)

  const getRandomPrompt = () => {
    const categories = Object.keys(promptCategories) as Array<keyof typeof promptCategories>
    const newCategory = categories[Math.floor(Math.random() * categories.length)]
    const prompts = promptCategories[newCategory]
    const newIndex = Math.floor(Math.random() * prompts.length)
    
    setCurrentCategory(newCategory)
    setCurrentPromptIndex(newIndex)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2 capitalize">{currentCategory}</p>
          <p className="text-lg mb-4">{promptCategories[currentCategory][currentPromptIndex]}</p>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={getRandomPrompt}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Prompt
            </Button>
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Use Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(promptCategories) as Array<keyof typeof promptCategories>).map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
} 