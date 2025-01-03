'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function DataVisualizationDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
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

  const filteredData = performanceData.slice(-parseInt(timeRange))

  const calculateAverages = () => {
    const averages: Record<string, number> = {}
    const categories = ['Clarity', 'Energy', 'Necessity', 'Productivity', 'Influence', 'Courage']
    categories.forEach(category => {
      averages[category] = filteredData.reduce((sum, entry) => sum + entry[category as keyof PerformanceData], 0) / filteredData.length
    })
    return averages
  }

  const averages = calculateAverages()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics Dashboard</CardTitle>
        <CardDescription>Visualize your progress across various performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Performance Over Time</TabsTrigger>
            <TabsTrigger value="mood-energy">Mood & Energy</TabsTrigger>
            <TabsTrigger value="averages">Category Averages</TabsTrigger>
          </TabsList>
          <TabsContent value="performance">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                {['Clarity', 'Energy', 'Necessity', 'Productivity', 'Influence', 'Courage'].map((category, index) => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={COLORS[index % COLORS.length]}
                    name={category}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="mood-energy">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood" />
                <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="averages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(averages).map(([category, value]) => ({ category, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(averages).map(([category, value]) => ({ name: category, value }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {Object.entries(averages).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

