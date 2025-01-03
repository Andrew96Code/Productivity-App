'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Friend = {
  id: string
  name: string
  avatar: string
  recentAchievement: string
}

export function SocialAccountability() {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const fetchFriends = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFriends([
        { id: '1', name: 'Alice', avatar: '/placeholder.svg', recentAchievement: 'Completed a 30-day meditation streak' },
        { id: '2', name: 'Bob', avatar: '/placeholder.svg', recentAchievement: 'Achieved the "Read 12 books" goal' },
        { id: '3', name: 'Charlie', avatar: '/placeholder.svg', recentAchievement: 'Maintained a daily exercise habit for 2 months' },
      ])
    }
    fetchFriends()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Accountability</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {friends.map(friend => (
            <li key={friend.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{friend.name}</p>
                <p className="text-sm text-gray-500">{friend.recentAchievement}</p>
              </div>
              <Button variant="outline" size="sm">Cheer</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

