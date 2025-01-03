'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Strategy {
  id: string
  title: string
  description: string
}

export function CopingStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: '1', title: 'Deep Breathing', description: 'Take slow, deep breaths to calm your mind and body.' },
    { id: '2', title: 'Progressive Muscle Relaxation', description: 'Tense and relax each muscle group in your body.' },
    { id: '3', title: 'Mindfulness Meditation', description: 'Focus on the present moment without judgment.' },
  ])
  const [newStrategy, setNewStrategy] = useState<Omit<Strategy, 'id'>>({
    title: '',
    description: ''
  })

  const addStrategy = () => {
    if (newStrategy.title && newStrategy.description) {
      setStrategies([...strategies, { ...newStrategy, id: Date.now().toString() }])
      setNewStrategy({ title: '', description: '' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coping Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <Card key={strategy.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{strategy.title}</h3>
                <p className="text-sm text-gray-500">{strategy.description}</p>
                <Button className="mt-2">Try Now</Button>
              </CardContent>
            </Card>
          ))}
          <div className="space-y-2">
            <Label htmlFor="new-strategy-title">Add New Strategy</Label>
            <Input
              id="new-strategy-title"
              value={newStrategy.title}
              onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
              placeholder="Strategy Title"
            />
            <Input
              value={newStrategy.description}
              onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
              placeholder="Strategy Description"
            />
            <Button onClick={addStrategy}>Add Strategy</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

