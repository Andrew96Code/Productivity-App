'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'performance', label: 'Performance', path: '/insights/performance' },
    { value: 'weekly', label: 'Weekly Review', path: '/insights/weekly' },
    { value: 'coach', label: 'AI Coach', path: '/insights/coach' },
    { value: 'analytics', label: 'Analytics', path: '/insights/analytics' },
    { value: 'trends', label: 'Trends', path: '/insights/trends' },
    { value: 'goals', label: 'Goals', path: '/insights/goals' },
    { value: 'time', label: 'Time Analysis', path: '/insights/time' },
    { value: 'habits', label: 'Habits', path: '/insights/habits' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'performance'

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Insights & Analytics</h1>
          <p className="text-muted-foreground">Track your progress and discover patterns</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs 
          defaultValue={currentTab} 
          onValueChange={(value) => {
            const tab = tabs.find(t => t.value === value)
            if (tab) router.push(tab.path)
          }}
        >
          <div className="border-b">
            <TabsList className="w-full h-auto p-0">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="min-h-[calc(100vh-16rem)]">
          {children}
        </div>
      </div>
    </div>
  )
} 