'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PenLine, Calendar as CalendarIcon, Tag, Smile, Search } from 'lucide-react'

interface JournalEntry {
  id: string
  date: Date
  content: string
  mood: string
  tags: string[]
}

const prompts = [
  "What's on your mind today?",
  "What are you grateful for?",
  "What challenges did you face today?",
  "What are your goals for tomorrow?",
  "What made you smile today?",
]

const moodOptions = [
  "😊 Happy",
  "😌 Calm",
  "😕 Anxious",
  "😢 Sad",
  "😤 Frustrated",
  "😴 Tired",
]

const tagOptions = [
  "Work", "Personal", "Health", "Relationships", "Goals", "Gratitude", "Challenges"
]

export function Journal() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSave = () => {
    // Save journal entry
    console.log({ date: selectedDate, content, mood, tags: selectedTags })
  }

  return (
    <div className="space-y-6">
      {/* New Entry */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>New Journal Entry</CardTitle>
            <Button onClick={handleSave}>Save Entry</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <Select value={currentPrompt} onValueChange={setCurrentPrompt}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt} value={prompt}>
                        {prompt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                className="min-h-[300px]"
              />

              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Mood</label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Card className="w-[300px]">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Past Entries */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Past Entries</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search entries..."
                className="pl-9 pr-4 py-2 rounded-md border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Example past entry */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      March 15, 2024
                    </span>
                  </div>
                  <Smile className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="mb-3">
                  Today was a productive day. I managed to complete all my tasks and had a great meeting with the team...
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Work</Badge>
                  <Badge variant="outline">Goals</Badge>
                  <Badge variant="outline">Gratitude</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 