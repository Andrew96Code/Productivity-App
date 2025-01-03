'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DailyJournal } from '@/components/journal/DailyJournal'
import { WeeklyJournal } from '@/components/journal/WeeklyJournal'
import { MonthlyJournal } from '@/components/journal/MonthlyJournal'
import { JournalDashboard } from '@/components/journal/JournalDashboard'
import { JournalSearch } from '@/components/journal/JournalSearch'
import { WritingPrompts } from '@/components/journal/WritingPrompts'
import { MoodEnergyChart } from '@/components/journal/MoodEnergyChart'

export default function JournalPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Journal & Reflections</h1>
          <p className="text-muted-foreground">Track your growth and insights</p>
        </div>
        <JournalSearch />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <DailyJournal />
            </TabsContent>
            
            <TabsContent value="weekly">
              <WeeklyJournal />
            </TabsContent>
            
            <TabsContent value="monthly">
              <MonthlyJournal />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Energy</CardTitle>
              <CardDescription>Track your daily patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodEnergyChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Writing Prompts</CardTitle>
              <CardDescription>Get inspired</CardDescription>
            </CardHeader>
            <CardContent>
              <WritingPrompts />
            </CardContent>
          </Card>

          <JournalDashboard />
        </div>
      </div>
    </div>
  )
}

