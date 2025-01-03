'use client'

import { useState } from 'react'
import { GoalTracker } from '../components/GoalTracker'
import { HabitTracker } from '../components/HabitTracker'
import { ProgressVisualization } from '../components/ProgressVisualization'
import { RewardSystem } from '../components/RewardSystem'
import { AISuggestions } from '../components/AISuggestions'
import { SocialAccountability } from '../components/SocialAccountability'
import { SkillDevelopment } from '../components/SkillDevelopment'
import { Reflection } from '../components/Reflection'
import { Notifications } from '../components/Notifications'
import { DataManagement } from '../components/DataManagement'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function GoalsHabitsPage() {
  const [activeTab, setActiveTab] = useState('goals')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Goals & Habits</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Track, manage, and achieve your goals and habits</CardTitle>
          <CardDescription>Set targets, build habits, visualize progress, and stay motivated</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </CardContent>
      </Card>
      <Notifications />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
        </TabsList>
        <TabsContent value="goals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalTracker />
            <AISuggestions type="goals" />
          </div>
        </TabsContent>
        <TabsContent value="habits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HabitTracker />
            <AISuggestions type="habits" />
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <SkillDevelopment />
        </TabsContent>
        <TabsContent value="progress">
          <div className="space-y-6">
            <ProgressVisualization />
            <RewardSystem />
          </div>
        </TabsContent>
        <TabsContent value="community">
          <SocialAccountability />
        </TabsContent>
        <TabsContent value="reflection">
          <Reflection />
        </TabsContent>
      </Tabs>
      <div className="mt-6">
        <DataManagement />
      </div>
    </div>
  )
}

