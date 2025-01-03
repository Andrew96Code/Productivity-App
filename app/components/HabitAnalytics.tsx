'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const habitCompletionData = [
  { name: 'Mon', completed: 3, total: 5 },
  { name: 'Tue', completed: 4, total: 5 },
  { name: 'Wed', completed: 5, total: 5 },
  { name: 'Thu', completed: 2, total: 5 },
  { name: 'Fri', completed: 4, total: 5 },
  { name: 'Sat', completed: 3, total: 5 },
  { name: 'Sun', completed: 5, total: 5 },
]

const habitProgressData = [
  { name: 'Week 1', progress: 60 },
  { name: 'Week 2', progress: 70 },
  { name: 'Week 3', progress: 75 },
  { name: 'Week 4', progress: 80 },
]

export function HabitAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Weekly Habit Completion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" name="Completed Habits" />
                <Bar dataKey="total" fill="#82ca9d" name="Total Habits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Habit Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={habitProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" name="Progress (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

