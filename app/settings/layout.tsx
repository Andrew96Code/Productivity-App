'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: 'general', label: 'General', path: '/settings/general' },
    { value: 'notifications', label: 'Notifications', path: '/settings/notifications' },
    { value: 'privacy', label: 'Privacy', path: '/settings/privacy' },
    { value: 'appearance', label: 'Appearance', path: '/settings/appearance' },
  ]

  const currentTab = tabs.find(tab => tab.path === pathname)?.value || 'general'

  return (
    <div>
      <div className="sticky top-14 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Settings</h1>
              <p className="text-muted-foreground">Customize your experience</p>
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

      <div className="container mx-auto p-4">
        <div className="min-h-[calc(100vh-16rem)]">
          {children}
        </div>
      </div>
    </div>
  )
} 