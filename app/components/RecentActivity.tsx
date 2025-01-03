import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export function RecentActivity() {
  const activities = [
    { id: 1, description: "Completed task: Update website content", time: "2 hours ago" },
    { id: 2, description: "Added new goal: Learn React", time: "5 hours ago" },
    { id: 3, description: "Achieved daily streak: 7 days", time: "1 day ago" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center space-x-2">
              <Activity className="text-blue-500" />
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

