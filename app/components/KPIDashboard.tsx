'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type KPI = {
  title: string
  value: number
  unit: string
  change: number
}

export function KPIDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([])

  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    const generateKPIs = () => [
      { title: 'Tasks Completed', value: Math.floor(Math.random() * 100), unit: '', change: Math.random() * 20 - 10 },
      { title: 'Average Focus Time', value: Math.random() * 4 + 2, unit: 'hours', change: Math.random() * 2 - 1 },
      { title: 'Productivity Score', value: Math.floor(Math.random() * 100), unit: '', change: Math.random() * 20 - 10 },
      { title: 'Goals Achieved', value: Math.floor(Math.random() * 5), unit: '', change: Math.random() * 2 - 1 },
    ]
    setKpis(generateKPIs())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
              <p className="text-2xl font-bold">
                {kpi.value.toFixed(1)}
                {kpi.unit}
              </p>
              <p className={`text-sm ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

