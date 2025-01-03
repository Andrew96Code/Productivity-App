'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function JournalEditor() {
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    mood: '',
    tags: []
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Entry title..."
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your thoughts..."
          className="min-h-[200px]"
          value={entry.content}
          onChange={(e) => setEntry({ ...entry, content: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label>Mood</Label>
          <Select
            value={entry.mood}
            onValueChange={(value) => setEntry({ ...entry, mood: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="great">Great</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="okay">Okay</SelectItem>
              <SelectItem value="down">Down</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="w-full">Save Entry</Button>
    </div>
  )
} 