'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell } from 'lucide-react'

type NotificationSetting = {
  type: string
  enabled: boolean
}

export function Notifications() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { type: 'Goal Reminders', enabled: true },
    { type: 'Habit Tracking', enabled: true },
    { type: 'Daily Reflection', enabled: false },
    { type: 'Weekly Summary', enabled: true },
  ])

  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
  }, [notificationSettings])

  const toggleNotification = (type: string) => {
    setNotificationSettings(notificationSettings.map(setting =>
      setting.type === type ? { ...setting, enabled: !setting.enabled } : setting
    ))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.type} className="flex items-center justify-between">
              <Label htmlFor={`notification-${setting.type}`} className="flex items-center space-x-2">
                <span>{setting.type}</span>
              </Label>
              <Switch
                id={`notification-${setting.type}`}
                checked={setting.enabled}
                onCheckedChange={() => toggleNotification(setting.type)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

