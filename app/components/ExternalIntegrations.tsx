'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type Integration = {
  id: string
  name: string
  description: string
  connected: boolean
  icon: string
}

export function ExternalIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'Google Calendar', description: 'Sync your tasks and events', connected: false, icon: '📅' },
    { id: '2', name: 'Todoist', description: 'Import and export tasks', connected: true, icon: '✅' },
    { id: '3', name: 'Fitbit', description: 'Track your fitness and sleep data', connected: false, icon: '⌚' },
    { id: '4', name: 'Spotify', description: 'Integrate your focus playlists', connected: false, icon: '🎵' },
    { id: '5', name: 'RescueTime', description: 'Monitor your digital time usage', connected: true, icon: '⏰' },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, connected: !integration.connected } : integration
    ))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>External Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                />
                <Label>{integration.connected ? 'Connected' : 'Disconnected'}</Label>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

