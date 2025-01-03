'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Star, Users, MessageCircle, Calendar, Target } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  expertise: string[]
  rating: number
  reviews: number
  availability: string
  mentees: number
  maxMentees: number
  description: string
  achievements: string[]
  isAvailable: boolean
}

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    role: 'Senior Product Manager',
    company: 'Tech Innovation Co',
    expertise: ['Product Strategy', 'Leadership', 'Career Development'],
    rating: 4.9,
    reviews: 124,
    availability: '5 hours/week',
    mentees: 3,
    maxMentees: 5,
    description: 'Experienced product leader helping professionals excel in product management and leadership roles.',
    achievements: ['10+ Years PM Experience', 'Led 20+ Successful Products', 'Published Author'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Alex Thompson',
    avatar: '/avatars/alex.jpg',
    role: 'Engineering Director',
    company: 'Global Tech Solutions',
    expertise: ['Technical Leadership', 'System Design', 'Team Building'],
    rating: 4.8,
    reviews: 89,
    availability: '3 hours/week',
    mentees: 4,
    maxMentees: 4,
    description: 'Helping engineers grow into technical leaders and navigate career challenges.',
    achievements: ['15+ Years Tech Experience', 'Built Multiple Engineering Teams', 'Conference Speaker'],
    isAvailable: false
  }
]

export function Mentorship() {
  const [activeMentors, setActiveMentors] = useState(mentors)

  const requestMentorship = (mentorId: string) => {
    // Handle mentorship request
    console.log(`Requesting mentorship from ${mentorId}`)
  }

  return (
    <div className="space-y-6">
      {/* Featured Mentor */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={mentors[0].avatar} alt={mentors[0].name} />
                  <AvatarFallback>{mentors[0].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{mentors[0].name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mentors[0].role} at {mentors[0].company}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">{mentors[0].description}</p>
              <div className="flex flex-wrap gap-2">
                {mentors[0].expertise.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{mentors[0].rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({mentors[0].reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{mentors[0].availability}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mentee Slots</span>
                  <span>{mentors[0].mentees}/{mentors[0].maxMentees}</span>
                </div>
                <Progress value={(mentors[0].mentees / mentors[0].maxMentees) * 100} />
              </div>
              <Button className="w-full" size="lg">
                Request Mentorship
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentor List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Mentors</TabsTrigger>
          <TabsTrigger value="available">Available Now</TabsTrigger>
          <TabsTrigger value="myMentors">My Mentors</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activeMentors.map((mentor) => (
            <Card key={mentor.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mentor.role} at {mentor.company}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={!mentor.isAvailable}
                    onClick={() => requestMentorship(mentor.id)}
                  >
                    {mentor.isAvailable ? 'Request Mentorship' : 'Not Available'}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">
                      {mentor.rating} ({mentor.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {mentor.mentees}/{mentor.maxMentees} mentees
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mentor.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Direct messaging</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available">
          {activeMentors.filter(mentor => mentor.isAvailable).map((mentor) => (
            // Similar card structure as above
            <Card key={mentor.id}>
              {/* Card content */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="myMentors">
          {/* My mentors content */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 