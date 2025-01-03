'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, FileText, Download, Share2, MoreVertical, Folder, Clock } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
  owner: {
    name: string
    avatar: string
  }
  shared: {
    name: string
    avatar: string
  }[]
  project: string
  tags: string[]
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-03-15',
    owner: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg'
    },
    shared: [
      { name: 'Alex Thompson', avatar: '/avatars/alex.jpg' },
      { name: 'Maria Garcia', avatar: '/avatars/maria.jpg' }
    ],
    project: 'Website Redesign',
    tags: ['documentation', 'requirements']
  },
  {
    id: '2',
    name: 'Design Assets.fig',
    type: 'Figma',
    size: '15.8 MB',
    lastModified: '2024-03-14',
    owner: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg'
    },
    shared: [
      { name: 'Sarah Chen', avatar: '/avatars/sarah.jpg' }
    ],
    project: 'Mobile App',
    tags: ['design', 'assets']
  }
]

const folders = [
  { id: '1', name: 'Project Documentation', files: 24 },
  { id: '2', name: 'Design Assets', files: 45 },
  { id: '3', name: 'Development Resources', files: 18 },
  { id: '4', name: 'Meeting Notes', files: 32 }
]

export function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">124</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Storage
                </p>
                <p className="text-2xl font-bold">2.4 GB</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Folder className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Shared Files
                </p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Share2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Recent Activity
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Folders</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Folder className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.files} files
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Documents</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Last modified: {new Date(doc.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-background">
                          <AvatarImage src={doc.owner.avatar} alt={doc.owner.name} />
                          <AvatarFallback>{doc.owner.name[0]}</AvatarFallback>
                        </Avatar>
                        {doc.shared.map((user) => (
                          <Avatar key={user.name} className="border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
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