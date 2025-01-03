'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'

export default function MentalHealthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'overview', label: 'Overview', path: '/mental-health/overview' },
    { value: 'mood', label: 'Mood Tracker', path: '/mental-health/mood' },
    { value: 'meditation', label: 'Meditation', path: '/mental-health/meditation' },
    { value: 'journal', label: 'Journal', path: '/mental-health/journal' },
    { value: 'coping', label: 'Coping Tools', path: '/mental-health/coping' },
    { value: 'resources', label: 'Resources', path: '/mental-health/resources' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'overview'

  return (
    <div>
      {/* Fixed Header with Title and Tabs */}
      <div className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Mental Health & Wellness</h1>
              <p className="text-muted-foreground">Track and improve your mental well-being</p>
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