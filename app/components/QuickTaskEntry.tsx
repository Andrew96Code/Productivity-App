'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle } from 'lucide-react'

export function QuickTaskEntry() {
  const [task, setTask] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would add the task to your task list
    console.log('New task:', task)
    setTask('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Task Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a new task"
          />
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

