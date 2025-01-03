'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react'

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  isLiked: boolean
}

const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      username: '@sarahchen'
    },
    content: 'Just completed a 30-day productivity challenge! Key takeaways: Time blocking is essential, and the Pomodoro technique really works. Who else has tried these methods? 📊✨',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    shares: 2,
    tags: ['ProductivityTip', 'TimeManagement'],
    isLiked: false
  },
  {
    id: '2',
    author: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg',
      username: '@alexthompson'
    },
    content: 'Milestone achieved! 🎉 Finally hit my goal of maintaining a daily meditation practice for 60 days straight. The impact on focus and stress management has been incredible.',
    timestamp: '4 hours ago',
    likes: 42,
    comments: 8,
    shares: 3,
    tags: ['Mindfulness', 'Achievement'],
    isLiked: true
  }
]

export function CommunityFeed() {
  const [newPost, setNewPost] = useState('')
  const [localPosts, setLocalPosts] = useState(posts)

  const handlePost = () => {
    if (!newPost.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        avatar: '/avatars/user.jpg',
        username: '@currentuser'
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      isLiked: false
    }

    setLocalPosts([post, ...localPosts])
    setNewPost('')
  }

  const toggleLike = (postId: string) => {
    setLocalPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/avatars/user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your productivity journey..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button onClick={handlePost}>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {localPosts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.username} • {post.timestamp}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <p className="mb-4">{post.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={post.isLiked ? 'text-primary' : ''}
                onClick={() => toggleLike(post.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                {post.shares}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 