'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'overview', label: 'Overview', path: '/habits/overview' },
    { value: 'formation', label: 'Formation', path: '/habits/formation' },
    { value: 'tracker', label: 'Tracker', path: '/habits/tracker' },
    { value: 'streak', label: 'Streak', path: '/habits/streak' },
    { value: 'analytics', label: 'Analytics', path: '/habits/analytics' },
    { value: 'community', label: 'Community', path: '/habits/community' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'overview'

  return (
    <div>
      {/* Fixed Header with Title and Tabs */}
      <div className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Habit Formation</h1>
              <p className="text-muted-foreground">Build and maintain positive habits</p>
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