'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Mail, MessageSquare, Calendar, Star } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  department: string
  skills: string[]
  availability: number
  activeProjects: number
  tasksCompleted: number
  rating: number
  status: 'available' | 'busy' | 'offline'
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Lead Designer',
    avatar: '/avatars/sarah.jpg',
    email: 'sarah.chen@example.com',
    department: 'Design',
    skills: ['UI/UX', 'Figma', 'Prototyping'],
    availability: 80,
    activeProjects: 3,
    tasksCompleted: 45,
    rating: 4.8,
    status: 'available'
  },
  {
    id: '2',
    name: 'Alex Thompson',
    role: 'Senior Developer',
    avatar: '/avatars/alex.jpg',
    email: 'alex.thompson@example.com',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript'],
    availability: 60,
    activeProjects: 2,
    tasksCompleted: 38,
    rating: 4.9,
    status: 'busy'
  }
]

export function TeamCollaboration() {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'busy':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'offline':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Team Members
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </p>
                <p className="text-2xl font-bold">8</p>
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
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Star className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Team Rating
                </p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Team Members</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role} • {member.department}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Availability</p>
                      <div className="mt-1 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{member.availability}%</span>
                        </div>
                        <Progress value={member.availability} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-lg font-medium">{member.activeProjects}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      <p className="text-lg font-medium">{member.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-lg font-medium">{member.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
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