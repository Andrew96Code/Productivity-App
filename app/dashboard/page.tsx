'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, BookOpen, CheckSquare, BarChart, 
  Users, Brain, Coins, Briefcase, Repeat, Workflow, 
  Wrench, Settings 
} from 'lucide-react'

const sections = [
  {
    name: 'Journal & Reflections',
    description: 'Track your thoughts and personal growth',
    icon: BookOpen,
    href: '/journal',
    color: 'bg-blue-500'
  },
  {
    name: 'Tasks & Goals',
    description: 'Manage your tasks and set goals',
    icon: CheckSquare,
    href: '/goals-habits',
    color: 'bg-green-500'
  },
  {
    name: 'Insights & Analytics',
    description: 'View your progress and analytics',
    icon: BarChart,
    href: '/insights',
    color: 'bg-purple-500'
  },
  {
    name: 'Community & Challenges',
    description: 'Connect with others and join challenges',
    icon: Users,
    href: '/community',
    color: 'bg-pink-500'
  },
  {
    name: 'Mental Health & Wellness',
    description: 'Track and improve your mental well-being',
    icon: Brain,
    href: '/mental-health',
    color: 'bg-yellow-500'
  },
  {
    name: 'Financial Goals',
    description: 'Manage your finances and set goals',
    icon: Coins,
    href: '/finances',
    color: 'bg-emerald-500'
  },
  {
    name: 'Project Management',
    description: 'Organize and track your projects',
    icon: Briefcase,
    href: '/projects',
    color: 'bg-indigo-500'
  },
  {
    name: 'Habit Formation',
    description: 'Build and track positive habits',
    icon: Repeat,
    href: '/habits',
    color: 'bg-orange-500'
  },
  {
    name: 'Customizable Workflows',
    description: 'Create and manage custom workflows',
    icon: Workflow,
    href: '/workflows',
    color: 'bg-cyan-500'
  },
  {
    name: 'Productivity Tools',
    description: 'Access productivity-enhancing tools',
    icon: Wrench,
    href: '/tools',
    color: 'bg-red-500'
  },
  {
    name: 'Settings',
    description: 'Customize your app experience',
    icon: Settings,
    href: '/settings',
    color: 'bg-gray-500'
  }
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your productivity hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.name} href={section.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${section.color} bg-opacity-10`}>
                    <section.icon className={`h-6 w-6 ${section.color} text-opacity-100`} />
                  </div>
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Habits Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">15 day streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 25m</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

