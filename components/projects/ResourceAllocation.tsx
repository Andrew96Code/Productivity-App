'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Calendar, Users, Brain, AlertCircle } from 'lucide-react'

interface Resource {
  id: string
  name: string
  type: 'human' | 'equipment' | 'software'
  category: string
  status: 'available' | 'allocated' | 'maintenance'
  allocation: number
  projects: {
    id: string
    name: string
    hours: number
  }[]
  skills?: string[]
  cost: number
  availability: {
    start: string
    end: string
  }
}

const resources: Resource[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    type: 'human',
    category: 'Design',
    status: 'allocated',
    allocation: 85,
    projects: [
      { id: '1', name: 'Website Redesign', hours: 20 },
      { id: '2', name: 'Mobile App', hours: 15 }
    ],
    skills: ['UI/UX', 'Figma', 'Prototyping'],
    cost: 75,
    availability: {
      start: '2024-03-01',
      end: '2024-06-30'
    }
  },
  {
    id: '2',
    name: 'Design Software License',
    type: 'software',
    category: 'Tools',
    status: 'available',
    allocation: 45,
    projects: [
      { id: '1', name: 'Website Redesign', hours: 40 }
    ],
    cost: 100,
    availability: {
      start: '2024-01-01',
      end: '2024-12-31'
    }
  }
]

export function ResourceAllocation() {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'allocated':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Resources
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Available Resources
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Allocated Resources
                </p>
                <p className="text-2xl font-bold">14</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Resource Conflicts
                </p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resources</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {resource.type === 'human' ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/avatars/${resource.id}.jpg`} alt={resource.name} />
                          <AvatarFallback>{resource.name[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h3 className="font-semibold">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.category} • ${resource.cost}/hour
                        </p>
                        {resource.skills && (
                          <div className="flex flex-wrap gap-2">
                            {resource.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Resource Allocation</span>
                        <span>{resource.allocation}%</span>
                      </div>
                      <Progress value={resource.allocation} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Current Projects</p>
                        <div className="space-y-2">
                          {resource.projects.map((project) => (
                            <div key={project.id} className="flex justify-between text-sm">
                              <span>{project.name}</span>
                              <span>{project.hours}h/week</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Availability</p>
                        <div className="text-sm">
                          <p>From: {new Date(resource.availability.start).toLocaleDateString()}</p>
                          <p>To: {new Date(resource.availability.end).toLocaleDateString()}</p>
                        </div>
                      </div>
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