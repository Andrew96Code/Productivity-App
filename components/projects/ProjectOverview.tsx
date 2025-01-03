'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Clock, Users, Target, ArrowRight, Filter } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  deadline: string
  team: {
    id: string
    name: string
    avatar: string
  }[]
  tasks: {
    total: number
    completed: number
  }
  priority: 'high' | 'medium' | 'low'
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Modernize the company website with new design and improved functionality.',
    status: 'active',
    progress: 65,
    deadline: '2024-04-30',
    team: [
      { id: '1', name: 'Sarah Chen', avatar: '/avatars/sarah.jpg' },
      { id: '2', name: 'Alex Thompson', avatar: '/avatars/alex.jpg' },
      { id: '3', name: 'Maria Garcia', avatar: '/avatars/maria.jpg' },
    ],
    tasks: {
      total: 24,
      completed: 16
    },
    priority: 'high'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement and support.',
    status: 'active',
    progress: 35,
    deadline: '2024-06-15',
    team: [
      { id: '4', name: 'James Wilson', avatar: '/avatars/james.jpg' },
      { id: '5', name: 'Emily Brown', avatar: '/avatars/emily.jpg' },
    ],
    tasks: {
      total: 32,
      completed: 12
    },
    priority: 'medium'
  }
]

export function ProjectOverview() {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Team Members
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold">64</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming Deadlines
                </p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Projects</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {project.tasks.completed}/{project.tasks.total} tasks
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {project.team.map((member) => (
                          <Avatar
                            key={member.id}
                            className="border-2 border-background w-8 h-8"
                          >
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
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