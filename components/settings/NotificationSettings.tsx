'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    goalUpdates: true
  })

  const handleSave = () => {
    console.log('Saving notification settings:', settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable All Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Master switch for all notifications
            </p>
          </div>
          <Switch
            checked={settings.enableNotifications}
            onCheckedChange={(checked) => {
              setSettings(prev => ({
                ...prev,
                enableNotifications: checked,
                emailNotifications: checked,
                pushNotifications: checked,
                taskReminders: checked,
                goalUpdates: checked
              }))
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, emailNotifications: checked }))
              }
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, pushNotifications: checked }))
              }
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Task Reminders</Label>
            <Switch
              checked={settings.taskReminders}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, taskReminders: checked }))
              }
              disabled={!settings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Goal Updates</Label>
            <Switch
              checked={settings.goalUpdates}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, goalUpdates: checked }))
              }
              disabled={!settings.enableNotifications}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
} 