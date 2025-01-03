import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ProductivityScore() {
  const score = 75 // This would be calculated based on user's activity

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center mb-4">{score}/100</div>
        <Progress value={score} className="w-full" />
      </CardContent>
    </Card>
  )
}

