'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Search, BookOpen, Play, Clock, Star, ArrowRight, Filter } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'course'
  category: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  reviews: number
  completed?: boolean
  progress?: number
  author: {
    name: string
    title: string
  }
  tags: string[]
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Personal Finance',
    description: 'Learn the fundamentals of managing your money and building financial security.',
    type: 'course',
    category: 'Personal Finance',
    duration: '2 hours',
    level: 'beginner',
    rating: 4.8,
    reviews: 245,
    progress: 60,
    author: {
      name: 'Sarah Chen',
      title: 'Financial Advisor'
    },
    tags: ['basics', 'budgeting', 'saving']
  },
  {
    id: '2',
    title: 'Investment Strategies for Beginners',
    description: 'Understanding different investment options and building a balanced portfolio.',
    type: 'video',
    category: 'Investing',
    duration: '45 minutes',
    level: 'beginner',
    rating: 4.6,
    reviews: 182,
    completed: true,
    author: {
      name: 'Alex Thompson',
      title: 'Investment Analyst'
    },
    tags: ['investing', 'stocks', 'portfolio']
  }
]

const popularTopics = [
  'Budgeting',
  'Investing',
  'Retirement',
  'Taxes',
  'Debt Management',
  'Real Estate',
  'Cryptocurrency',
  'Insurance'
]

export function FinancialEducation() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Search and Topics */}
      <div className="flex gap-4 items-start">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {popularTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="cursor-pointer">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">
                  Courses in Progress
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">
                  Hours Learned
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">
                  Certificates Earned
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Resource List */}
      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <Badge variant="outline">{resource.type}</Badge>
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
                {resource.type === 'video' ? (
                  <Play className="h-8 w-8 text-primary" />
                ) : (
                  <BookOpen className="h-8 w-8 text-primary" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{resource.rating}</span>
                      <span className="text-muted-foreground">
                        ({resource.reviews})
                      </span>
                    </div>
                  </div>
                  <Badge>{resource.level}</Badge>
                </div>

                {resource.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{resource.progress}%</span>
                    </div>
                    <Progress value={resource.progress} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <p className="font-medium">{resource.author.name}</p>
                    <p className="text-muted-foreground">{resource.author.title}</p>
                  </div>
                  <Button>
                    {resource.completed ? 'Review' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 