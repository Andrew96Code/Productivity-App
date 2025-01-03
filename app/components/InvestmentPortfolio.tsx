'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

type Investment = {
  id: string
  name: string
  type: string
  amount: number
  performance: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const performanceData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

export function InvestmentPortfolio() {
  const [investments, setInvestments] = useState<Investment[]>([
    { id: '1', name: 'S&P 500 ETF', type: 'ETF', amount: 5000, performance: 8.5 },
    { id: '2', name: 'Apple Inc.', type: 'Stock', amount: 3000, performance: 12.3 },
    { id: '3', name: 'US Treasury Bonds', type: 'Bonds', amount: 2000, performance: 2.1 },
  ])
  const [newInvestment, setNewInvestment] = useState<Omit<Investment, 'id' | 'performance'>>({
    name: '',
    type: '',
    amount: 0
  })

  const addInvestment = () => {
    if (newInvestment.name && newInvestment.type && newInvestment.amount > 0) {
      setInvestments([...investments, { ...newInvestment, id: Date.now().toString(), performance: Math.random() * 15 }])
      setNewInvestment({ name: '', type: '', amount: 0 })
    }
  }

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Investments</h3>
            {investments.map((investment) => (
              <div key={investment.id} className="flex justify-between items-center mb-2">
                <span>{investment.name} ({investment.type})</span>
                <span>${investment.amount} ({investment.performance.toFixed(2)}%)</span>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <Input
                placeholder="Investment name"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
              />
              <Select
                value={newInvestment.type}
                onValueChange={(value) => setNewInvestment({ ...newInvestment, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Investment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Stock">Stock</SelectItem>
                  <SelectItem value="Bonds">Bonds</SelectItem>
                  <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={newInvestment.amount || ''}
                onChange={(e) => setNewInvestment({ ...newInvestment, amount: Number(e.target.value) })}
              />
              <Button onClick={addInvestment}>Add Investment</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Portfolio Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investments}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {investments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center mt-4">Total Investment: ${totalInvestment}</p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

