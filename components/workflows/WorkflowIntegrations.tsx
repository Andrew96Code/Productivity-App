'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Link2, Settings2, Power, Shield } from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  usageQuota: number
  apiCalls: number
  features: string[]
  icon: string
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Google Calendar',
    description: 'Sync calendar events and schedule workflows',
    category: 'Calendar',
    status: 'connected',
    lastSync: '2024-02-16T10:30:00',
    usageQuota: 85,
    apiCalls: 1245,
    features: ['Event Creation', 'Schedule Sync', 'Availability Check'],
    icon: '/icons/google-calendar.svg'
  },
  {
    id: '2',
    name: 'Slack',
    description: 'Send notifications and updates to channels',
    category: 'Communication',
    status: 'connected',
    lastSync: '2024-02-16T10:25:00',
    usageQuota: 45,
    apiCalls: 856,
    features: ['Message Send', 'Channel Management', 'User Lookup'],
    icon: '/icons/slack.svg'
  }
]

export function WorkflowIntegrations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500/10 text-green-500'
      case 'disconnected': return 'bg-gray-500/10 text-gray-500'
      case 'error': return 'bg-red-500/10 text-red-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Available Integrations</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {/* Add category filter here */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIntegrations.map(integration => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>

                  {/* Integration details */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Sync</p>
                      <p className="font-medium">
                        {new Date(integration.lastSync).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">API Calls</p>
                      <p className="font-medium">{integration.apiCalls}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Usage Quota</p>
                      <div className="flex items-center gap-2">
                        <Progress value={integration.usageQuota} className="flex-1" />
                        <span className="text-sm">{integration.usageQuota}%</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Settings2 className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 