'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type Reminder = {
  id: string
  text: string
  time: string
  enabled: boolean
}

export function SelfCareReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Take a short walk', time: '10:00', enabled: true },
    { id: '2', text: 'Practice mindfulness', time: '14:00', enabled: true },
    { id: '3', text: 'Drink water', time: '16:00', enabled: true },
  ])
  const [newReminder, setNewReminder] = useState({ text: '', time: '' })

  const addReminder = () => {
    if (newReminder.text && newReminder.time) {
      setReminders([...reminders, { ...newReminder, id: Date.now().toString(), enabled: true }])
      setNewReminder({ text: '', time: '' })
    }
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self-Care Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{reminder.text}</p>
                <p className="text-sm text-gray-500">{reminder.time}</p>
              </div>
              <Switch
                checked={reminder.enabled}
                onCheckedChange={() => toggleReminder(reminder.id)}
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="new-reminder-text">Add New Reminder</Label>
            <Input
              id="new-reminder-text"
              value={newReminder.text}
              onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
              placeholder="Reminder text"
            />
            <Input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            />
            <Button onClick={addReminder}>Add Reminder</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

