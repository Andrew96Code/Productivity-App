'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, MessageCircle } from 'lucide-react'

type Post = {
  id: string
  author: string
  avatar: string
  content: string
  likes: number
  comments: number
}

export function HabitCommunity() {
  const [posts, setPosts] = useState<Post[]>([
    { id: '1', author: 'Alice', avatar: '/avatars/alice.jpg', content: 'Just completed my 30-day meditation challenge!', likes: 15, comments: 3 },
    { id: '2', author: 'Bob', avatar: '/avatars/bob.jpg', content: 'Looking for accountability partners for a new exercise habit. Anyone interested?', likes: 8, comments: 5 },
    { id: '3', author: 'Charlie', avatar: '/avatars/charlie.jpg', content: 'Tip: Use habit stacking to build new habits more easily!', likes: 12, comments: 2 },
  ])
  const [newPost, setNewPost] = useState('')

  const addPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        avatar: '/avatars/you.jpg',
        content: newPost,
        likes: 0,
        comments: 0,
      }
      setPosts([post, ...posts])
      setNewPost('')
    }
  }

  const likePost = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Community</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your habit journey..."
            />
            <Button onClick={addPost}>Post</Button>
          </div>
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-gray-500 mb-2">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" onClick={() => likePost(post.id)}>
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        {post.comments}
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
  )
}

