'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Star, Download, Heart, MessageSquare } from 'lucide-react'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  author: {
    name: string
    avatar: string
  }
  rating: number
  reviews: number
  likes: number
  steps: number
  tags: string[]
  popularity: 'trending' | 'new' | 'top'
}

const templates: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'Daily Task Management',
    description: 'Automate your daily task organization and prioritization',
    category: 'Productivity',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg'
    },
    rating: 4.8,
    reviews: 245,
    likes: 1200,
    steps: 5,
    tags: ['tasks', 'automation', 'daily'],
    popularity: 'trending'
  },
  {
    id: '2',
    name: 'Project Status Updates',
    description: 'Automatically collect and send project status updates',
    category: 'Project Management',
    author: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg'
    },
    rating: 4.6,
    reviews: 182,
    likes: 850,
    steps: 7,
    tags: ['project', 'reporting', 'team'],
    popularity: 'top'
  }
]

export function WorkflowLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="project">Project Management</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Submit Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="relative">
                {template.popularity === 'trending' && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-orange-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Trending
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{template.rating}</span>
                          <span className="text-muted-foreground">
                            ({template.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{template.likes}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{template.steps} steps</Badge>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10" />
                        <span className="text-sm">{template.author.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reviews
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Use Template
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

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-4">
        {['Productivity', 'Project Management', 'Communication'].map((category) => (
          <Card key={category} className="cursor-pointer hover:bg-accent">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{category}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse {category.toLowerCase()} workflow templates
              </p>
              <Button variant="outline" className="w-full">
                View Templates
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 