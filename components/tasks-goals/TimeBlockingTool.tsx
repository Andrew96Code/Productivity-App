'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Clock, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface TimeBlock {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  category: string
  color: string
}

const COLORS = [
  { name: 'Deep Work', value: 'bg-blue-100 dark:bg-blue-900/20' },
  { name: 'Meetings', value: 'bg-purple-100 dark:bg-purple-900/20' },
  { name: 'Planning', value: 'bg-green-100 dark:bg-green-900/20' },
  { name: 'Break', value: 'bg-yellow-100 dark:bg-yellow-900/20' },
]

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0')
  return `${hour}:00`
})

export function TimeBlockingTool() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: COLORS[0].name,
  })

  const addBlock = () => {
    if (!newBlock.title.trim()) return

    const block: TimeBlock = {
      id: Date.now().toString(),
      ...newBlock,
      date: selectedDate,
      color: COLORS.find(c => c.name === newBlock.category)?.value || COLORS[0].value,
    }

    setBlocks([...blocks, block])
    setNewBlock({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      category: COLORS[0].name,
    })
  }

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
  }

  const getDayBlocks = (date: Date) => {
    return blocks.filter(block => 
      format(block.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Time Block</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newBlock.category}
                onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select
                value={newBlock.startTime}
                onValueChange={(value) => setNewBlock({ ...newBlock, startTime: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Select
                value={newBlock.endTime}
                onValueChange={(value) => setNewBlock({ ...newBlock, endTime: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>Block Title</Label>
            <div className="flex gap-2">
              <Input
                value={newBlock.title}
                onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                placeholder="Enter block title..."
              />
              <Button onClick={addBlock}>
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule for {format(selectedDate, 'PPPP')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getDayBlocks(selectedDate).map(block => (
              <div
                key={block.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md",
                  block.color
                )}
              >
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{block.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {block.startTime} - {block.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{block.category}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 