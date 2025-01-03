'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy } from 'lucide-react'

type Reward = {
  id: string
  name: string
  description: string
  pointsRequired: number
  achieved: boolean
}

export function RewardSystem() {
  const [points, setPoints] = useState(0)
  const [rewards, setRewards] = useState<Reward[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const initialRewards: Reward[] = [
      { id: '1', name: 'Productivity Master', description: 'Complete 50 tasks', pointsRequired: 500, achieved: false },
      { id: '2', name: 'Habit Hero', description: 'Maintain a 30-day streak', pointsRequired: 1000, achieved: false },
      { id: '3', name: 'Goal Crusher', description: 'Achieve 10 goals', pointsRequired: 2000, achieved: false },
    ]
    setRewards(initialRewards)
    setPoints(750) // Example initial points
  }, [])

  const claimReward = (rewardId: string) => {
    setRewards(rewards.map(reward =>
      reward.id === rewardId ? { ...reward, achieved: true } : reward
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Your Points</h3>
          <Progress value={(points / 2000) * 100} className="w-full" />
          <p className="text-right mt-1">{points} / 2000</p>
        </div>
        <div className="space-y-4">
          {rewards.map(reward => (
            <Card key={reward.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{reward.name}</h4>
                    <p className="text-sm text-gray-500">{reward.description}</p>
                  </div>
                  {reward.achieved ? (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <Button
                      onClick={() => claimReward(reward.id)}
                      disabled={points < reward.pointsRequired}
                    >
                      Claim ({reward.pointsRequired} pts)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

