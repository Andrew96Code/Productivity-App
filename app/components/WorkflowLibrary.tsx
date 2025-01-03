'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type WorkflowTemplate = {
  id: string
  name: string
  description: string
  category: string
}

export function WorkflowLibrary() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
    { id: '1', name: 'Morning Routine', description: 'A workflow to start your day productively', category: 'Personal' },
    { id: '2', name: 'Project Kickoff', description: 'Steps to initiate a new project', category: 'Work' },
    { id: '3', name: 'Content Creation', description: 'Workflow for creating and publishing content', category: 'Marketing' },
  ])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Templates</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or category"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                  <p className="text-sm text-gray-500 mb-4">Category: {template.category}</p>
                  <Button>Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

