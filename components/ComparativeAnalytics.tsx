'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', thisWeek: 4, lastWeek: 3 },
  { name: 'Tue', thisWeek: 6, lastWeek: 5 },
  { name: 'Wed', thisWeek: 8, lastWeek: 7 },
  { name: 'Thu', thisWeek: 7, lastWeek: 6 },
  { name: 'Fri', thisWeek: 9, lastWeek: 8 },
]

type MetricType = 'productivity' | 'focus' | 'wellbeing'

export function ComparativeAnalytics() {
  const [metric, setMetric] = useState<MetricType>('productivity')

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Comparative Analytics</CardTitle>
          <Select value={metric} onValueChange={(value: MetricType) => setMetric(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="wellbeing">Wellbeing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisWeek" name="This Week" fill="#8884d8" />
              <Bar dataKey="lastWeek" name="Last Week" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

