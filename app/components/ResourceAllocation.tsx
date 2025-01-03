'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Resource = {
  id: string
  name: string
  type: string
  allocation: number
}

export function ResourceAllocation() {
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'John Doe', type: 'Developer', allocation: 80 },
    { id: '2', name: 'Jane Smith', type: 'Designer', allocation: 60 },
    { id: '3', name: 'Meeting Room A', type: 'Facility', allocation: 40 },
  ])
  const [newResource, setNewResource] = useState<Omit<Resource, 'id'>>({
    name: '',
    type: '',
    allocation: 0
  })

  const addResource = () => {
    if (newResource.name && newResource.type && newResource.allocation > 0) {
      setResources([...resources, { ...newResource, id: Date.now().toString() }])
      setNewResource({ name: '', type: '', allocation: 0 })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="resource-name">Resource Name</Label>
              <Input
                id="resource-name"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                placeholder="Enter resource name"
              />
            </div>
            <div>
              <Label htmlFor="resource-type">Resource Type</Label>
              <Select
                value={newResource.type}
                onValueChange={(value) => setNewResource({ ...newResource, type: value })}
              >
                <SelectTrigger id="resource-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Facility">Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="resource-allocation">Allocation (%)</Label>
              <Input
                id="resource-allocation"
                type="number"
                value={newResource.allocation || ''}
                onChange={(e) => setNewResource({ ...newResource, allocation: Number(e.target.value) })}
                placeholder="Enter allocation percentage"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addResource}>Add Resource</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.allocation}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

