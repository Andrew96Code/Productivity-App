'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'
import { AITaskSuggestions } from '@/components/tasks-goals/AITaskSuggestions'

export default function TasksGoalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'tasks', label: 'Tasks', path: '/tasks-goals/tasks' },
    { value: 'goals', label: 'Goals', path: '/tasks-goals/goals' },
    { value: 'habits', label: 'Habits', path: '/tasks-goals/habits' },
    { value: 'matrix', label: 'Priority Matrix', path: '/tasks-goals/matrix' },
    { value: 'timeblock', label: 'Time Blocking', path: '/tasks-goals/timeblock' },
    { value: 'progress', label: 'Progress', path: '/tasks-goals/progress' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'tasks'

  return (
    <div>
      {/* Fixed Header with Title and Tabs */}
      <div className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Tasks & Goals</h1>
              <p className="text-muted-foreground">Manage your tasks, goals, and habits</p>
            </div>
            <div className="mt-4">
              <AITaskSuggestions />
            </div>
          </div>

          <Tabs 
            defaultValue={currentTab} 
            onValueChange={(value) => {
              const tab = tabs.find(t => t.value === value)
              if (tab) router.push(tab.path)
            }}
          >
            <TabsList className="w-full h-auto p-0 bg-transparent">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="min-h-[calc(100vh-16rem)]">
          {children}
        </div>
      </div>
    </div>
  )
} 