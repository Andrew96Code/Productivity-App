'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

type WeeklyReview = {
  weekStarting: string
  accomplishments: string
  challenges: string
  lessonsLearned: string
  gratitude: string
}

type WeeklyPlan = {
  weekStarting: string
  topGoals: Array<{ text: string; progress: number }>
  keyTasks: string[]
  focusAreas: string[]
  personalDevelopment: string
}

export function WeeklyReviewPlanning() {
  const [review, setReview] = useState<WeeklyReview>({
    weekStarting: '',
    accomplishments: '',
    challenges: '',
    lessonsLearned: '',
    gratitude: ''
  })

  const [plan, setPlan] = useState<WeeklyPlan>({
    weekStarting: '',
    topGoals: [
      { text: '', progress: 0 },
      { text: '', progress: 0 },
      { text: '', progress: 0 }
    ],
    keyTasks: ['', '', '', '', ''],
    focusAreas: ['', '', ''],
    personalDevelopment: ''
  })

  useEffect(() => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)))
    const weekStarting = startOfWeek.toISOString().split('T')[0]

    setReview(prev => ({ ...prev, weekStarting }))
    setPlan(prev => ({ ...prev, weekStarting }))

    const savedReview = localStorage.getItem(`weekly-review-${weekStarting}`)
    const savedPlan = localStorage.getItem(`weekly-plan-${weekStarting}`)

    if (savedReview) {
      setReview(JSON.parse(savedReview))
    }
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan))
    }
  }, [])

  const handleReviewChange = (field: keyof WeeklyReview, value: string) => {
    setReview(prev => ({ ...prev, [field]: value }))
  }

  const handlePlanChange = (field: keyof WeeklyPlan, value: string | Array<{ text: string; progress: number }> | string[], index?: number) => {
    setPlan(prev => {
      if (field === 'topGoals' && Array.isArray(value)) {
        return { ...prev, [field]: value }
      }
      if (Array.isArray(prev[field]) && typeof index === 'number') {
        const newArray = [...prev[field] as string[]]
        newArray[index] = value as string
        return { ...prev, [field]: newArray }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleGoalProgressChange = (index: number, progress: number) => {
    setPlan(prev => {
      const newGoals = [...prev.topGoals]
      newGoals[index] = { ...newGoals[index], progress }
      return { ...prev, topGoals: newGoals }
    })
  }

  const saveWeeklyReviewAndPlan = () => {
    localStorage.setItem(`weekly-review-${review.weekStarting}`, JSON.stringify(review))
    localStorage.setItem(`weekly-plan-${plan.weekStarting}`, JSON.stringify(plan))
    alert('Weekly review and plan saved successfully!')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Weekly Review and Planning</CardTitle>
        <CardDescription>Reflect on your past week and plan for the next one</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="review">
          <TabsList>
            <TabsTrigger value="review">Weekly Review</TabsTrigger>
            <TabsTrigger value="plan">Weekly Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="review">
            <div className="space-y-4">
              <div>
                <Label htmlFor="weekStarting">Week Starting</Label>
                <Input
                  id="weekStarting"
                  type="date"
                  value={review.weekStarting}
                  onChange={(e) => handleReviewChange('weekStarting', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accomplishments">Key Accomplishments</Label>
                <Textarea
                  id="accomplishments"
                  value={review.accomplishments}
                  onChange={(e) => handleReviewChange('accomplishments', e.target.value)}
                  placeholder="What were your main achievements this week?"
                />
              </div>
              <div>
                <Label htmlFor="challenges">Challenges Faced</Label>
                <Textarea
                  id="challenges"
                  value={review.challenges}
                  onChange={(e) => handleReviewChange('challenges', e.target.value)}
                  placeholder="What obstacles did you encounter and how did you handle them?"
                />
              </div>
              <div>
                <Label htmlFor="lessonsLearned">Lessons Learned</Label>
                <Textarea
                  id="lessonsLearned"
                  value={review.lessonsLearned}
                  onChange={(e) => handleReviewChange('lessonsLearned', e.target.value)}
                  placeholder="What insights or new knowledge did you gain?"
                />
              </div>
              <div>
                <Label htmlFor="gratitude">Gratitude</Label>
                <Textarea
                  id="gratitude"
                  value={review.gratitude}
                  onChange={(e) => handleReviewChange('gratitude', e.target.value)}
                  placeholder="What are you grateful for this week?"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="plan">
            <div className="space-y-4">
              <div>
                <Label htmlFor="planWeekStarting">Week Starting</Label>
                <Input
                  id="planWeekStarting"
                  type="date"
                  value={plan.weekStarting}
                  onChange={(e) => handlePlanChange('weekStarting', e.target.value)}
                />
              </div>
              <div>
                <Label>Top 3 Goals for the Week</Label>
                {plan.topGoals.map((goal, index) => (
                  <div key={index} className="space-y-2 mt-2">
                    <Input
                      value={goal.text}
                      onChange={(e) => handlePlanChange('topGoals', plan.topGoals.map((g, i) => i === index ? { ...g, text: e.target.value } : g))}
                      placeholder={`Goal ${index + 1}`}
                    />
                    <div className="flex items-center space-x-2">
                      <Progress value={goal.progress} className="flex-grow" />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleGoalProgressChange(index, Number(e.target.value))}
                        className="w-20"
                      />
                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Label>Key Tasks</Label>
                {plan.keyTasks.map((task, index) => (
                  <Input
                    key={index}
                    value={task}
                    onChange={(e) => handlePlanChange('keyTasks', e.target.value, index)}
                    placeholder={`Task ${index + 1}`}
                    className="mt-2"
                  />
                ))}
              </div>
              <div>
                <Label>Focus Areas</Label>
                {plan.focusAreas.map((area, index) => (
                  <Input
                    key={index}
                    value={area}
                    onChange={(e) => handlePlanChange('focusAreas', e.target.value, index)}
                    placeholder={`Focus Area ${index + 1}`}
                    className="mt-2"
                  />
                ))}
              </div>
              <div>
                <Label htmlFor="personalDevelopment">Personal Development Focus</Label>
                <Textarea
                  id="personalDevelopment"
                  value={plan.personalDevelopment}
                  onChange={(e) => handlePlanChange('personalDevelopment', e.target.value)}
                  placeholder="What skill or habit will you focus on developing this week?"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={saveWeeklyReviewAndPlan}>Save Weekly Review and Plan</Button>
      </CardFooter>
    </Card>
  )
}

