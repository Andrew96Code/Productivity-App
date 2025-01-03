'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const workflowExecutionData = [
  { name: 'Mon', executions: 12 },
  { name: 'Tue', executions: 15 },
  { name: 'Wed', executions: 18 },
  { name: 'Thu', executions: 10 },
  { name: 'Fri', executions: 14 },
  { name: 'Sat', executions: 8 },
  { name: 'Sun', executions: 6 },
]

const workflowCategoryData = [
  { name: 'Personal', value: 30 },
  { name: 'Work', value: 45 },
  { name: 'Marketing', value: 15 },
  { name: 'Finance', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function WorkflowAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Executions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workflowExecutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="executions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workflowCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {workflowCategoryData.map((entry, index) => (
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

