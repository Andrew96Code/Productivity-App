'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Users, Target, Clock, Search, Plus } from 'lucide-react'

interface Group {
  id: string
  name: string
  description: string
  category: string
  members: {
    id: string
    name: string
    avatar: string
    role: 'leader' | 'member'
  }[]
  activeChallenge?: {
    title: string
    progress: number
    daysLeft: number
  }
  tags: string[]
  isJoined: boolean
}

const groups: Group[] = [
  {
    id: '1',
    name: 'Deep Work Enthusiasts',
    description: 'A community focused on mastering the art of deep work and focused productivity.',
    category: 'Productivity',
    members: [
      { id: '1', name: 'Sarah Chen', avatar: '/avatars/sarah.jpg', role: 'leader' },
      { id: '2', name: 'Alex Thompson', avatar: '/avatars/alex.jpg', role: 'member' },
      { id: '3', name: 'Maria Garcia', avatar: '/avatars/maria.jpg', role: 'member' },
    ],
    activeChallenge: {
      title: '30 Days of Deep Work',
      progress: 65,
      daysLeft: 12
    },
    tags: ['Deep Work', 'Focus', 'Productivity'],
    isJoined: true
  },
  {
    id: '2',
    name: 'Goal Achievers',
    description: 'Support group for ambitious individuals working towards their personal and professional goals.',
    category: 'Goals',
    members: [
      { id: '4', name: 'James Wilson', avatar: '/avatars/james.jpg', role: 'leader' },
      { id: '5', name: 'Emily Brown', avatar: '/avatars/emily.jpg', role: 'member' },
    ],
    activeChallenge: {
      title: 'Quarterly Goals Sprint',
      progress: 45,
      daysLeft: 20
    },
    tags: ['Goals', 'Achievement', 'Support'],
    isJoined: false
  }
]

export function Groups() {
  const [activeGroups, setActiveGroups] = useState(groups)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleJoinGroup = (groupId: string) => {
    setActiveGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return { ...group, isJoined: !group.isJoined }
      }
      return group
    }))
  }

  return (
    <div className="space-y-6">
      {/* Search and Create */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {activeGroups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {group.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant={group.isJoined ? "outline" : "default"}
                  onClick={() => toggleJoinGroup(group.id)}
                >
                  {group.isJoined ? 'Leave' : 'Join'}
                </Button>
              </div>

              {/* Members */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {group.members.length} members
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {group.members.map((member) => (
                    <Avatar key={member.id} className="border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {/* Active Challenge */}
              {group.activeChallenge && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">{group.activeChallenge.title}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {group.activeChallenge.daysLeft} days left
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Group Progress</span>
                        <span>{group.activeChallenge.progress}%</span>
                      </div>
                      <Progress value={group.activeChallenge.progress} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 