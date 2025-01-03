'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type IntegrationTool = {
  name: string
  connected: boolean
  icon: string
}

export function ExternalToolsIntegration() {
  const [tools, setTools] = useState<IntegrationTool[]>([
    { name: 'Google Calendar', connected: false, icon: '📅' },
    { name: 'Slack', connected: false, icon: '💬' },
    { name: 'Trello', connected: false, icon: '📋' },
    { name: 'GitHub', connected: false, icon: '🐙' },
  ])

  const toggleConnection = (index: number) => {
    const newTools = [...tools]
    newTools[index].connected = !newTools[index].connected
    setTools(newTools)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Tools Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tools.map((tool, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{tool.icon}</span>
                <Label htmlFor={`${tool.name}-toggle`}>{tool.name}</Label>
              </div>
              <Switch
                id={`${tool.name}-toggle`}
                checked={tool.connected}
                onCheckedChange={() => toggleConnection(index)}
              />
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full">Sync Data</Button>
      </CardContent>
    </Card>
  )
}

