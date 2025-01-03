'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, Users, Video, MapPin, Clock } from 'lucide-react'
import { format, isFuture, isPast } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string
  type: 'webinar' | 'workshop' | 'challenge' | 'meetup'
  date: Date
  time: string
  duration: string
  host: {
    name: string
    avatar: string
    role: string
  }
  participants: number
  maxParticipants?: number
  location?: string
  link?: string
  isRegistered: boolean
  tags: string[]
}

const events: Event[] = [
  {
    id: '1',
    title: 'Mastering Deep Work',
    description: 'Learn techniques to achieve deep focus and maximize productivity in this interactive workshop.',
    type: 'webinar',
    date: new Date('2024-03-15'),
    time: '10:00 AM',
    duration: '90 minutes',
    host: {
      name: 'Dr. Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      role: 'Productivity Expert'
    },
    participants: 145,
    maxParticipants: 200,
    link: 'https://zoom.us/j/123456789',
    isRegistered: true,
    tags: ['Productivity', 'Focus', 'Workshop']
  },
  {
    id: '2',
    title: 'Goal Setting Workshop',
    description: 'Interactive session on setting and achieving meaningful goals using proven frameworks.',
    type: 'workshop',
    date: new Date('2024-03-20'),
    time: '2:00 PM',
    duration: '2 hours',
    host: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg',
      role: 'Goal Achievement Coach'
    },
    participants: 85,
    maxParticipants: 100,
    location: 'Innovation Hub, San Francisco',
    isRegistered: false,
    tags: ['Goals', 'Planning', 'Workshop']
  }
]

export function Events() {
  const [activeEvents, setActiveEvents] = useState(events)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const toggleRegistration = (eventId: string) => {
    setActiveEvents(events => events.map(event => {
      if (event.id === eventId) {
        return { ...event, isRegistered: !event.isRegistered }
      }
      return event
    }))
  }

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'webinar':
        return <Video className="h-4 w-4" />
      case 'workshop':
        return <Users className="h-4 w-4" />
      case 'challenge':
        return <CalendarIcon className="h-4 w-4" />
      case 'meetup':
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar and Upcoming Events */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Featured Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={events[0].host.avatar} alt={events[0].host.name} />
                  <AvatarFallback>{events[0].host.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{events[0].title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Hosted by {events[0].host.name} • {events[0].host.role}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground">{events[0].description}</p>

              <div className="flex flex-wrap gap-2">
                {events[0].tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{format(events[0].date, 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{events[0].time}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event List */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {activeEvents.filter(event => isFuture(event.date)).map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Button
                    variant={event.isRegistered ? "outline" : "default"}
                    onClick={() => toggleRegistration(event.id)}
                  >
                    {event.isRegistered ? 'Registered' : 'Register'}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(event.date, 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{event.time} ({event.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {event.participants}{event.maxParticipants ? `/${event.maxParticipants}` : ''} attending
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="registered">
          {activeEvents.filter(event => event.isRegistered).map((event) => (
            // Similar card structure as above
            <Card key={event.id}>
              {/* Card content */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past">
          {activeEvents.filter(event => isPast(event.date)).map((event) => (
            // Similar card structure as above
            <Card key={event.id}>
              {/* Card content */}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
} 