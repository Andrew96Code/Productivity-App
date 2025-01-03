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
}

export function WorkflowIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'Slack', description: 'Send notifications to Slack channels', connected: false },
    { id: '2', name: 'Google Calendar', description: 'Create and manage events', connected: true },
    { id: '3', name: 'Trello', description: 'Create cards and manage boards', connected: false },
    { id: '4', name: 'Zapier', description: 'Connect with thousands of apps', connected: false },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, connected: !integration.connected } : integration
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.description}</p>
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

