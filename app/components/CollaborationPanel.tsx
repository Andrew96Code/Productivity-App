'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '../types/task'

interface CollaborationPanelProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
}

export function CollaborationPanel({ tasks, onUpdateTask }: CollaborationPanelProps) {
  const [newCollaborator, setNewCollaborator] = useState('')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddCollaborator = () => {
    if (newCollaborator && selectedTask) {
      const taskToUpdate = tasks.find(task => task.id === selectedTask)
      if (taskToUpdate) {
        onUpdateTask({ ...taskToUpdate, collaborator: newCollaborator })
        setNewCollaborator('')
        setSelectedTask(null)
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedTask || ''} onValueChange={setSelectedTask}>
            <SelectTrigger>
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map(task => (
                <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Collaborator's name or email"
            value={newCollaborator}
            onChange={(e) => setNewCollaborator(e.target.value)}
          />
          <Button onClick={handleAddCollaborator}>Assign Task</Button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Assigned Tasks:</h3>
          <ul>
            {tasks.filter(task => task.assignedTo).map(task => (
              <li key={task.id}>{task.title} - Assigned to: {task.assignedTo}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

