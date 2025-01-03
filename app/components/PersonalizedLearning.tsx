'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Skill = {
  id: string
  name: string
  progress: number
  level: number
}

type LearningResource = {
  id: string
  title: string
  type: 'video' | 'article' | 'course'
  duration: string
  skillId: string
}

export function PersonalizedLearning() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [resources, setResources] = useState<LearningResource[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from your backend
    setSkills([
      { id: '1', name: 'JavaScript', progress: 65, level: 2 },
      { id: '2', name: 'React', progress: 40, level: 1 },
      { id: '3', name: 'Node.js', progress: 20, level: 1 },
    ])

    setResources([
      { id: '1', title: 'Advanced JavaScript Concepts', type: 'course', duration: '4 hours', skillId: '1' },
      { id: '2', title: 'React Hooks in Depth', type: 'video', duration: '45 minutes', skillId: '2' },
      { id: '3', title: 'Building RESTful APIs with Node.js', type: 'article', duration: '15 minutes', skillId: '3' },
    ])
  }, [])

  const completeResource = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId)
    if (resource) {
      const updatedSkills = skills.map(skill => {
        if (skill.id === resource.skillId) {
          const newProgress = Math.min(skill.progress + 10, 100)
          const newLevel = Math.floor(newProgress / 33) + 1
          return { ...skill, progress: newProgress, level: newLevel }
        }
        return skill
      })
      setSkills(updatedSkills)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Skills</h3>
            {skills.map(skill => (
              <div key={skill.id} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span>{skill.name}</span>
                  <Badge>Level {skill.level}</Badge>
                </div>
                <Progress value={skill.progress} className="w-full" />
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommended Resources</h3>
            {resources.map(resource => (
              <Card key={resource.id} className="mb-2">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-gray-500">
                        {resource.type} • {resource.duration}
                      </p>
                    </div>
                    <Button onClick={() => completeResource(resource.id)}>Complete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

