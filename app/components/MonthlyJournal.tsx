'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const monthlyReviewQuestions = [
  "What were your biggest achievements this month?",
  "How have you grown personally and professionally?",
  "What challenges did you face and how did you overcome them?",
  "What habits or behaviors would you like to change next month?",
  "What are your top goals for next month?",
  "How can you break down these goals into weekly targets?",
  "What resources or support do you need to achieve these goals?"
]

const highPerformanceHabits = [
  'Clarity',
  'Energy',
  'Necessity',
  'Productivity',
  'Influence',
  'Courage'
]

export function MonthlyJournal() {
  const [monthlyEntries, setMonthlyEntries] = useState({})
  const [monthlyScores, setMonthlyScores] = useState({})
  const [monthlyScore, setMonthlyScore] = useState<number>(5)

  const handleMonthlyChange = (question, answer) => {
    setMonthlyEntries(prev => ({ ...prev, [question]: answer }))
  }

  const calculateMonthlyScores = () => {
    // In a real app, this would fetch the weekly scores for the month and calculate averages
    // For this example, we'll simulate it with random scores
    const newScores = {}
    highPerformanceHabits.forEach(habit => {
      const weeklyScores = Array(4).fill(0).map(() => Math.random() * 10)
      newScores[habit] = (weeklyScores.reduce((sum, score) => sum + score, 0) / 4).toFixed(2)
    })
    setMonthlyScores(newScores)

    // Calculate overall monthly score
    const overallMonthlyScore = Object.values(newScores).reduce((sum, score) => sum + parseFloat(score), 0) / highPerformanceHabits.length
    setMonthlyScore(Math.round(overallMonthlyScore))
  }

  const findMonthlyAreaForImprovement = () => {
    return Object.entries(monthlyScores).reduce((lowest, [habit, score]) => 
      score < lowest.score ? { habit, score } : lowest
    , { habit: '', score: Infinity }).habit
  }

  const saveMonthlyReviewAndPlan = () => {
    const monthlyData = {
      monthStarting: new Date().toISOString().split('T')[0], // Use current date as the start of the month
      entries: monthlyEntries,
      scores: monthlyScores,
      overallScore: monthlyScore
    }
    localStorage.setItem(`monthly-review-${monthlyData.monthStarting}`, JSON.stringify(monthlyData))
    alert('Monthly review, plan, and scores saved successfully!')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Monthly Journal</CardTitle>
        <CardDescription>Review your month and plan for the next</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-score">Monthly Score (1-10)</Label>
            <Input
              id="monthly-score"
              type="number"
              min="1"
              max="10"
              value={monthlyScore}
              onChange={(e) => setMonthlyScore(Number(e.target.value))}
            />
          </div>
          {monthlyReviewQuestions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={`monthly-q${index}`} className="font-medium">
                {question}
              </label>
              <Textarea
                id={`monthly-q${index}`}
                value={monthlyEntries[question] || ''}
                onChange={(e) => handleMonthlyChange(question, e.target.value)}
              />
            </div>
          ))}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Monthly High Performance Scores</h3>
            {highPerformanceHabits.map(habit => (
              <p key={habit}>{habit}: {monthlyScores[habit] || 'N/A'}</p>
            ))}
            <p>Area for Improvement: {findMonthlyAreaForImprovement()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={calculateMonthlyScores} className="mr-2">Calculate Monthly Scores</Button>
        <Button onClick={saveMonthlyReviewAndPlan}>Save Monthly Journal</Button>
      </CardFooter>
    </Card>
  )
}

export default MonthlyJournal;

