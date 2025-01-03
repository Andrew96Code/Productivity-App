'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, Sparkles, Target, Brain, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Suggestion {
  id: string
  title: string
  description: string
  category: 'productivity' | 'goals' | 'habits' | 'focus'
  icon: typeof Bot
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Time Blocking Strategy',
    description: 'Based on your productivity patterns, try blocking 90-minute focus sessions in the morning.',
    category: 'productivity',
    icon: Clock
  },
  {
    id: '2',
    title: 'Goal Alignment',
    description: 'Your current tasks seem disconnected from your quarterly goals. Let\'s align them better.',
    category: 'goals',
    icon: Target
  },
  {
    id: '3',
    title: 'Habit Stacking',
    description: 'Consider adding meditation to your morning routine right after your coffee.',
    category: 'habits',
    icon: Brain
  }
]

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI productivity coach. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand you\'re looking to improve your productivity. Based on your recent activity, I\'d recommend focusing on time blocking and setting clear priorities for each day.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>AI Coach Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 text-sm",
                      message.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%]",
                      message.role === 'assistant' 
                        ? "bg-muted" 
                        : "bg-primary text-primary-foreground"
                    )}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Personalized Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon
              return (
                <Card key={suggestion.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="p-2 bg-primary/10 rounded-full h-fit">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{suggestion.title}</p>
                          <Badge variant="secondary">{suggestion.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Review Goals
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Brain className="mr-2 h-4 w-4" />
              Get Productivity Tips
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Action Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 