import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Task } from '../types/task'

type TaskDetailsModalProps = {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
}

export function TaskDetailsModal({ task, isOpen, onClose, onUpdate }: TaskDetailsModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task)

  if (!task || !editedTask) return null

  const handleUpdate = () => {
    onUpdate(editedTask)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>View and edit task details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={editedTask.priority}
              onValueChange={(value: 'Low' | 'Medium' | 'High') => setEditedTask({ ...editedTask, priority: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={editedTask.status}
              onValueChange={(value: 'Todo' | 'In Progress' | 'Done') => setEditedTask({ ...editedTask, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Calendar
              mode="single"
              selected={editedTask.dueDate}
              onSelect={(date) => date && setEditedTask({ ...editedTask, dueDate: date })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={editedTask.tags.join(', ')}
              onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="col-span-3"
              placeholder="Enter tags, separated by commas"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurring" className="text-right">
              Recurring
            </Label>
            <Checkbox
              id="recurring"
              checked={editedTask.recurring}
              onCheckedChange={(checked) => setEditedTask({ ...editedTask, recurring: checked as boolean })}
            />
          </div>
          {editedTask.recurring && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurringInterval" className="text-right">
                Interval
              </Label>
              <Select
                value={editedTask.recurringInterval}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setEditedTask({ ...editedTask, recurringInterval: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

