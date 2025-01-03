'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

type Reminder = {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'task'
  time: string
  days: string[]
  enabled: boolean
}

export function ReminderSystem() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id'>>({
    type: 'daily',
    time: '09:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    enabled: true
  })

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }, [reminders])

  const addReminder = () => {
    const newId = Date.now().toString()
    setReminders([...reminders, { ...newReminder, id: newId }])
    setNewReminder({
      type: 'daily',
      time: '09:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      enabled: true
    })
    toast({
      title: "Reminder added",
      description: "Your new reminder has been successfully added.",
    })
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
    toast({
      title: "Reminder deleted",
      description: "The reminder has been successfully deleted.",
    })
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reminder System</CardTitle>
        <CardDescription>Set up reminders for your journaling practice and important tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reminderType">Reminder Type</Label>
              <Select
                value={newReminder.type}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'task') => 
                  setNewReminder({ ...newReminder, type: value })
                }
              >
                <SelectTrigger id="reminderType">
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Journal</SelectItem>
                  <SelectItem value="weekly">Weekly Review</SelectItem>
                  <SelectItem value="monthly">Monthly Reflection</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reminderTime">Reminder Time</Label>
              <Input
                id="reminderTime"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Days of Week</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  variant={newReminder.days.includes(day) ? 'default' : 'outline'}
                  onClick={() => {
                    const updatedDays = newReminder.days.includes(day)
                      ? newReminder.days.filter(d => d !== day)
                      : [...newReminder.days, day]
                    setNewReminder({ ...newReminder, days: updatedDays })
                  }}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={addReminder}>Add Reminder</Button>
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Current Reminders</h3>
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder</p>
                  <p className="text-sm text-gray-500">
                    {reminder.time} - {reminder.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => deleteReminder(reminder.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

