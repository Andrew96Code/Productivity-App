'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'

export function AppearanceSettings() {
  const [settings, setSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    colorScheme: 'default',
    reducedMotion: false
  })

  const handleSave = () => {
    console.log('Saving appearance settings:', settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <RadioGroup
            value={settings.theme}
            onValueChange={(value) => setSettings({ ...settings, theme: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-1">
                <Moon className="h-4 w-4" /> Dark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" /> System
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select
            value={settings.fontSize}
            onValueChange={(value) => setSettings({ ...settings, fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <Label>Color Scheme</Label>
          </div>
          <Select
            value={settings.colorScheme}
            onValueChange={(value) => setSettings({ ...settings, colorScheme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="high-contrast">High Contrast</SelectItem>
              <SelectItem value="colorblind">Colorblind Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
} 