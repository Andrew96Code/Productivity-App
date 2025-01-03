'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const taskCompletionData = [
  { name: 'Week 1', completed: 12, total: 20 },
  { name: 'Week 2', completed: 15, total: 20 },
  { name: 'Week 3', completed: 18, total: 20 },
  { name: 'Week 4', completed: 20, total: 20 }
]

const taskDistributionData = [
  { name: 'To Do', value: 10 },
  { name: 'In Progress', value: 15 },
  { name: 'Done', value: 25 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export function ProjectAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Task Completion Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" name="Completed Tasks" />
                <Bar dataKey="total" fill="#82ca9d" name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

