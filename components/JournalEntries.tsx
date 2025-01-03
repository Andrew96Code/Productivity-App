'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const sampleEntries = [
  {
    id: '1',
    title: 'Morning Reflection',
    content: 'Today started off great. I feel energized and ready to tackle my goals...',
    date: new Date(),
    mood: 'Great',
    tags: ['Morning', 'Gratitude']
  },
  {
    id: '2',
    title: 'Weekly Goals Review',
    content: 'Reflecting on this week\'s progress. Made significant strides in...',
    date: new Date(Date.now() - 86400000),
    mood: 'Good',
    tags: ['Goals', 'Progress']
  }
]

export function JournalEntries() {
  return (
    <div className="space-y-4">
      {sampleEntries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{entry.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {entry.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {format(entry.date, 'MMM d, yyyy')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 