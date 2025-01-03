'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    language: 'en',
    autoSave: true,
    dataSync: true,
    theme: 'system'
  })

  const handleSave = () => {
    console.log('Saving general settings:', settings)
    // Here you would typically save to backend/localStorage
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => setSettings({ ...settings, language: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save your work
            </p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Data Synchronization</Label>
            <p className="text-sm text-muted-foreground">
              Sync your data across devices
            </p>
          </div>
          <Switch
            checked={settings.dataSync}
            onCheckedChange={(checked) => setSettings({ ...settings, dataSync: checked })}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
} 