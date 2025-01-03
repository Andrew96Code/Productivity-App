'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, MessageSquare, Heart, Share2, Users, Trophy, Star } from 'lucide-react'

interface CommunityPost {
  id: string
  user: {
    name: string
    avatar: string
    level: number
  }
  content: string
  habit: string
  streak: number
  likes: number
  comments: number
  timestamp: string
  tags: string[]
}

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  duration: string
  progress: number
  category: string
  reward: string
}

const posts: CommunityPost[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      level: 12
    },
    content: 'Just completed my 30-day meditation challenge! Feeling more focused and calm than ever.',
    habit: 'Meditation',
    streak: 30,
    likes: 24,
    comments: 8,
    timestamp: '2 hours ago',
    tags: ['meditation', 'mindfulness', 'achievement']
  },
  {
    id: '2',
    user: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg',
      level: 8
    },
    content: 'Looking for accountability partners for my morning workout routine. Anyone interested?',
    habit: 'Exercise',
    streak: 15,
    likes: 12,
    comments: 5,
    timestamp: '4 hours ago',
    tags: ['fitness', 'accountability', 'motivation']
  }
]

const challenges: Challenge[] = [
  {
    id: '1',
    title: '30 Days of Mindfulness',
    description: 'Practice mindfulness meditation for 10 minutes daily',
    participants: 245,
    duration: '30 days',
    progress: 65,
    category: 'Mindfulness',
    reward: 'Mindfulness Master Badge'
  },
  {
    id: '2',
    title: 'Morning Routine Challenge',
    description: 'Establish a consistent morning routine for 21 days',
    participants: 182,
    duration: '21 days',
    progress: 45,
    category: 'Productivity',
    reward: 'Early Bird Badge'
  }
]

export function HabitCommunity() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Members
                </p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Challenges
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </p>
                <p className="text-2xl font-bold">3.2K</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Your Level
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Active Challenges</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <Badge variant="secondary">{challenge.category}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>{challenge.reward}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} />
                    </div>

                    <Button className="w-full">Join Challenge</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Feed */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Community Feed</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.user.name}</span>
                            <Badge variant="secondary">Level {post.user.level}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                        </div>
                        <Badge>{post.habit}</Badge>
                      </div>

                      <p>{post.content}</p>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-4 border-t">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
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