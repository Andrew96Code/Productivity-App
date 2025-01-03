import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export function UpcomingTasks() {
  const tasks = [
    { id: 1, title: "Team meeting", dueDate: "Today, 2:00 PM" },
    { id: 2, title: "Complete project proposal", dueDate: "Tomorrow, 5:00 PM" },
    { id: 3, title: "Review client feedback", dueDate: "Wed, 11:00 AM" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center space-x-2">
              <CheckCircle className="text-gray-400" />
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.dueDate}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

