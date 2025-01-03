'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
}

export function TeamCollaboration() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alice Johnson', role: 'Project Manager', avatar: '/avatars/alice.jpg' },
    { id: '2', name: 'Bob Smith', role: 'Developer', avatar: '/avatars/bob.jpg' },
    { id: '3', name: 'Charlie Brown', role: 'Designer', avatar: '/avatars/charlie.jpg' },
  ])
  const [newMember, setNewMember] = useState({ name: '', role: '' })

  const addMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers([...teamMembers, { ...newMember, id: Date.now().toString(), avatar: '/avatars/placeholder.jpg' }])
      setNewMember({ name: '', role: '' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Collaboration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-member-name">Add New Team Member</Label>
            <Input
              id="new-member-name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Name"
            />
            <Select
              value={newMember.role}
              onValueChange={(value) => setNewMember({ ...newMember, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA Tester">QA Tester</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addMember}>Add Member</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

