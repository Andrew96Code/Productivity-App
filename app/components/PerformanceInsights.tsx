'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type PerformanceData = {
  date: string
  Clarity: number
  Energy: number
  Necessity: number
  Productivity: number
  Influence: number
  Courage: number
  mood: number
  energy: number
}

type Insight = {
  category: string
  score: number
  trend: 'improving' | 'declining' | 'stable'
  recommendation: string
}

export function PerformanceInsights() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    // Fetch performance data from local storage
    const allEntries: PerformanceData[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('journal-')) {
        const entry = JSON.parse(localStorage.getItem(key) || '{}')
        const performanceEntry: PerformanceData = {
          date: entry.date,
          Clarity: calculateCategoryAverage(entry.scores, 'Clarity'),
          Energy: calculateCategoryAverage(entry.scores, 'Energy'),
          Necessity: calculateCategoryAverage(entry.scores, 'Necessity'),
          Productivity: calculateCategoryAverage(entry.scores, 'Productivity'),
          Influence: calculateCategoryAverage(entry.scores, 'Influence'),
          Courage: calculateCategoryAverage(entry.scores, 'Courage'),
          mood: entry.mood,
          energy: entry.energy
        }
        allEntries.push(performanceEntry)
      }
    }
    allEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setPerformanceData(allEntries)
  }, [])

  const calculateCategoryAverage = (scores: Record<string, number>, category: string) => {
    const categoryScores = Object.entries(scores)
      .filter(([key]) => key.startsWith(category))
      .map(([, value]) => value)
    return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
  }

  const generateInsights = () => {
    const categories = ['Clarity', 'Energy', 'Necessity', 'Productivity', 'Influence', 'Courage']
    const newInsights: Insight[] = []

    categories.forEach(category => {
      const scores = performanceData.map(entry => entry[category as keyof PerformanceData] as number)
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const trend = determineTrend(scores)
      const recommendation = generateRecommendation(category, averageScore, trend)

      newInsights.push({
        category,
        score: averageScore,
        trend,
        recommendation
      })
    })

    setInsights(newInsights)
  }

  const determineTrend = (scores: number[]): 'improving' | 'declining' | 'stable' => {
    if (scores.length < 2) return 'stable'
    const recentScores = scores.slice(-5)
    const averageChange = (recentScores[recentScores.length - 1] - recentScores[0]) / (recentScores.length - 1)
    if (averageChange > 0.5) return 'improving'
    if (averageChange < -0.5) return 'declining'
    return 'stable'
  }

  const generateRecommendation = (category: string, score: number, trend: string): string => {
    const recommendations = {
      Clarity: [
        "Set clear, specific goals for each day and week.",
        "Practice mindfulness meditation to improve focus.",
        "Break large tasks into smaller, manageable steps."
      ],
      Energy: [
        "Establish a consistent sleep schedule.",
        "Incorporate regular exercise into your routine.",
        "Take short breaks throughout the day to recharge."
      ],
      Necessity: [
        "Prioritize tasks using the Eisenhower Matrix.",
        "Learn to say 'no' to non-essential commitments.",
        "Regularly review and update your goals and priorities."
      ],
      Productivity: [
        "Use the Pomodoro Technique for focused work sessions.",
        "Minimize distractions in your work environment.",
        "Track your time to identify and eliminate time-wasters."
      ],
      Influence: [
        "Practice active listening in your interactions.",
        "Seek opportunities to mentor or teach others.",
        "Work on your public speaking and presentation skills."
      ],
      Courage: [
        "Set a goal to try one new thing each week.",
        "Practice reframing negative self-talk.",
        "Celebrate small wins and learn from setbacks."
      ]
    }

    const categoryRecommendations = recommendations[category as keyof typeof recommendations]
    const randomRecommendation = categoryRecommendations[Math.floor(Math.random() * categoryRecommendations.length)]

    if (score < 5) {
      return `Your ${category} score is low. ${randomRecommendation}`
    } else if (score < 7) {
      return `Your ${category} score is average. To improve: ${randomRecommendation}`
    } else {
      return `Great job on ${category}! To maintain or further improve: ${randomRecommendation}`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
        <CardDescription>AI-generated insights and recommendations based on your journal entries and performance data</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={generateInsights} className="mb-4">Generate Insights</Button>
        {insights.length > 0 && (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <Accordion type="single" collapsible className="w-full">
              {insights.map((insight, index) => (
                <AccordionItem key={insight.category} value={`item-${index}`}>
                  <AccordionTrigger>
                    {insight.category} - Score: {insight.score.toFixed(2)} ({insight.trend})
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{insight.recommendation}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

