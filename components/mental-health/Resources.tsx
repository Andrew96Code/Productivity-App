'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, Mail, Globe, Book, Video, Users, Search, ExternalLink } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'contact' | 'community'
  category: string
  link?: string
  phone?: string
  email?: string
  tags: string[]
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Crisis Support Hotline',
    description: '24/7 confidential support for mental health crises.',
    type: 'contact',
    category: 'Emergency',
    phone: '1-800-273-8255',
    email: 'support@crisis.org',
    tags: ['Crisis', 'Support', 'Emergency']
  },
  {
    id: '2',
    title: 'Understanding Stress Management',
    description: 'Comprehensive guide to managing stress and anxiety.',
    type: 'article',
    category: 'Education',
    link: 'https://example.com/stress-management',
    tags: ['Stress', 'Anxiety', 'Self-Help']
  },
  {
    id: '3',
    title: 'Mindfulness for Beginners',
    description: 'Video series introducing mindfulness practices.',
    type: 'video',
    category: 'Mindfulness',
    link: 'https://example.com/mindfulness-series',
    tags: ['Mindfulness', 'Meditation', 'Beginner']
  }
]

export function Resources() {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <Book className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'contact':
        return <Phone className="h-5 w-5" />
      case 'community':
        return <Users className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Emergency Support */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-red-500/10">
              <Phone className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Need immediate support?</h2>
              <p className="text-sm text-muted-foreground">
                24/7 Crisis support is available
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Button className="w-full" size="lg">
              <Phone className="mr-2 h-4 w-4" />
              Call Support Line
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mental Health Resources</CardTitle>
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search resources..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <h3 className="font-semibold">{resource.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {resource.link && (
                          <Button className="w-full" variant="outline">
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Resource
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                        {resource.phone && (
                          <Button className="w-full">
                            <Phone className="mr-2 h-4 w-4" />
                            {resource.phone}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Local Support */}
      <Card>
        <CardHeader>
          <CardTitle>Local Support Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Support Groups</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Find local support groups and community meetings.
                </p>
                <Button variant="outline" className="w-full">
                  Find Groups
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Therapist Directory</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with mental health professionals in your area.
                </p>
                <Button variant="outline" className="w-full">
                  Find Therapists
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Online Services</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Access virtual therapy and counseling services.
                </p>
                <Button variant="outline" className="w-full">
                  Browse Services
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 