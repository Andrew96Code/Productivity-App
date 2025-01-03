'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit2, Trash2 } from 'lucide-react'

type Skill = {
  id: string
  name: string
  category: string
  currentLevel: number
  targetLevel: number
  progress: number
}

export function SkillDevelopment() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: '',
    currentLevel: 1,
    targetLevel: 10,
    progress: 0
  })
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills')
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills))
  }, [skills])

  const addSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, { ...newSkill, id: Date.now().toString() }])
      setNewSkill({ name: '', category: '', currentLevel: 1, targetLevel: 10, progress: 0 })
    }
  }

  const updateSkillProgress = (id: string, progress: number) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, progress: Math.min(100, Math.max(0, progress)) } : skill
    ))
  }

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const editSkill = (id: string) => {
    setEditingSkillId(id)
    const skillToEdit = skills.find(skill => skill.id === id)
    if (skillToEdit) {
      setNewSkill({
        name: skillToEdit.name,
        category: skillToEdit.category,
        currentLevel: skillToEdit.currentLevel,
        targetLevel: skillToEdit.targetLevel,
        progress: skillToEdit.progress
      })
    }
  }

  const saveEditedSkill = () => {
    if (editingSkillId) {
      setSkills(skills.map(skill =>
        skill.id === editingSkillId ? { ...skill, ...newSkill } : skill
      ))
      setEditingSkillId(null)
      setNewSkill({ name: '', category: '', currentLevel: 1, targetLevel: 10, progress: 0 })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Development</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => editSkill(skill.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">Category: {skill.category}</p>
                <Progress value={skill.progress} className="mb-2" />
                <div className="flex justify-between items-center">
                  <span>Level {skill.currentLevel}</span>
                  <Input
                    type="number"
                    value={skill.progress}
                    onChange={(e) => updateSkillProgress(skill.id, Number(e.target.value))}
                    className="w-20"
                  />
                  <span>Level {skill.targetLevel}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</h3>
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              id="skillName"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Enter skill name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newSkill.category}
              onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem<SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Physical">Physical</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLevel">Current Level</Label>
            <Input
              id="currentLevel"
              type="number"
              value={newSkill.currentLevel}
              onChange={(e) => setNewSkill({ ...newSkill, currentLevel: Number(e.target.value) })}
              min={1}
              max={10}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetLevel">Target Level</Label>
            <Input
              id="targetLevel"
              type="number"
              value={newSkill.targetLevel}
              onChange={(e) => setNewSkill({ ...newSkill, targetLevel: Number(e.target.value) })}
              min={1}
              max={10}
            />
          </div>
          <Button onClick={editingSkillId ? saveEditedSkill : addSkill} className="w-full">
            {editingSkillId ? 'Save Changes' : 'Add Skill'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

