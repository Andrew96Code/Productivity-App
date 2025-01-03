'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Plus, Calendar as CalendarIcon, Trash2, Edit2, MoreVertical } from 'lucide-react'

interface TimeBlock {
  id: string
  title: string
  startTime: string
  endTime: string
  category: string
  priority: 'high' | 'medium' | 'low'
  date: Date
  completed: boolean
}

const categories = [
  'Deep Work',
  'Meetings',
  'Learning',
  'Exercise',
  'Planning',
  'Break'
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0')
  return {
    value: `${hour}:00`,
    label: `${hour}:00`
  }
})

export function TimeBlocking() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [newBlock, setNewBlock] = useState<Partial<TimeBlock>>({
    date: new Date(),
    category: categories[0],
    priority: 'medium'
  })

  const addBlock = () => {
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) return

    const block: TimeBlock = {
      id: Date.now().toString(),
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category || categories[0],
      priority: newBlock.priority || 'medium',
      date: newBlock.date || new Date(),
      completed: false
    }

    setBlocks([...blocks, block])
    setNewBlock({
      date: new Date(),
      category: categories[0],
      priority: 'medium'
    })
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const toggleBlockCompletion = (id: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, completed: !block.completed } : block
    ))
  }

  const getDayBlocks = (date: Date) => {
    return blocks.filter(block => 
      block.date.toDateString() === date.toDateString()
    ).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    )
  }

  const getPriorityColor = (priority: TimeBlock['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return ''
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Calendar and Form */}
      <div className="col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />

            <div className="space-y-4">
              <Input
                placeholder="Block title..."
                value={newBlock.title || ''}
                onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newBlock.startTime}
                  onValueChange={(value) => setNewBlock({ ...newBlock, startTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={newBlock.endTime}
                  onValueChange={(value) => setNewBlock({ ...newBlock, endTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={newBlock.category}
                onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newBlock.priority}
                onValueChange={(value) => 
                  setNewBlock({ 
                    ...newBlock, 
                    priority: value as TimeBlock['priority'] 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full" onClick={addBlock}>
                <Plus className="h-4 w-4 mr-2" />
                Add Time Block
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Blocks */}
      <div className="col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>
              Schedule for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {getDayBlocks(selectedDate).map(block => (
                  <Card key={block.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={block.completed}
                            onChange={() => toggleBlockCompletion(block.id)}
                            className="rounded-full"
                          />
                          <div>
                            <h3 className={`font-medium ${block.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {block.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {block.startTime} - {block.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{block.category}</Badge>
                          <Badge className={getPriorityColor(block.priority)}>
                            {block.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 