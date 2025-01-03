'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type ReflectionEntry = {
  id: string
  date: string
  content: string
  lessons: string
  tags: string[]
}

export function Reflection() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([])
  const [newReflection, setNewReflection] = useState<Omit<ReflectionEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    content: '',
    lessons: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const savedReflections = localStorage.getItem('reflections')
    if (savedReflections) {
      setReflections(JSON.parse(savedReflections))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('reflections', JSON.stringify(reflections))
  }, [reflections])

  const addReflection = () => {
    if (newReflection.content) {
      setReflections([{ ...newReflection, id: Date.now().toString() }, ...reflections])
      setNewReflection({
        date: new Date().toISOString().split('T')[0],
        content: '',
        lessons: '',
        tags: []
      })
    }
  }

  const addTag = () => {
    if (newTag && !newReflection.tags.includes(newTag)) {
      setNewReflection({ ...newReflection, tags: [...newReflection.tags, newTag] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewReflection({
      ...newReflection,
      tags: newReflection.tags.filter(tag => tag !== tagToRemove)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reflectionDate">Date</Label>
            <Input
              id="reflectionDate"
              type="date"
              value={newReflection.date}
              onChange={(e) => setNewReflection({ ...newReflection, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reflectionContent">Today's Reflection</Label>
            <Textarea
              id="reflectionContent"
              value={newReflection.content}
              onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
              placeholder="Write your thoughts about today..."
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lessons">Key Lessons or Insights</Label>
            <Textarea
              id="lessons"
              value={newReflection.lessons}
              onChange={(e) => setNewReflection({ ...newReflection, lessons: e.target.value })}
              placeholder="What did you learn today?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Button onClick={addTag}>Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newReflection.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={addReflection} className="w-full">Save Reflection</Button>
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold">Previous Reflections</h3>
          {reflections.map((reflection) => (
            <Card key={reflection.id}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-2">{new Date(reflection.date).toLocaleDateString()}</p>
                <p className="mb-2">{reflection.content}</p>
                <p className="text-sm"><strong>Lessons:</strong> {reflection.lessons}</p>
                <div className="mt-2">
                  {reflection.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="mr-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

