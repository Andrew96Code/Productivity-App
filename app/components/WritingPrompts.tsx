'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function WritingPrompts() {
  const [prompt, setPrompt] = useState('')

  const prompts = [
    "What are you most grateful for today?",
    "Describe a challenge you overcame recently.",
    "What's your biggest goal for this month?",
    "Reflect on a recent accomplishment.",
    "How have you grown in the past year?",
  ]

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)])
  }, [])

  const getNewPrompt = () => {
    let newPrompt
    do {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    } while (newPrompt === prompt)
    setPrompt(newPrompt)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{prompt}</p>
        <Button onClick={getNewPrompt}>New Prompt</Button>
      </CardContent>
    </Card>
  )
}

