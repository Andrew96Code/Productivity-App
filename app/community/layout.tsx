'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'feed', label: 'Community Feed', path: '/community/feed' },
    { value: 'challenges', label: 'Challenges', path: '/community/challenges' },
    { value: 'groups', label: 'Groups', path: '/community/groups' },
    { value: 'events', label: 'Events', path: '/community/events' },
    { value: 'mentorship', label: 'Mentorship', path: '/community/mentorship' },
    { value: 'leaderboard', label: 'Leaderboard', path: '/community/leaderboard' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'feed'

  return (
    <div>
      {/* Fixed Header with Title and Tabs */}
      <div className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Community & Challenges</h1>
              <p className="text-muted-foreground">Connect, compete, and grow together</p>
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