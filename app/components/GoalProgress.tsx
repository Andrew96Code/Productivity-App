import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function GoalProgress() {
  const goals = [
    { name: "Complete Project X", progress: 60 },
    { name: "Learn New Skill", progress: 40 },
    { name: "Improve Fitness", progress: 80 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{goal.name}</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

