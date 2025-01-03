'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart as ChartIcon, Plus } from 'lucide-react'

interface Investment {
  id: string
  name: string
  type: 'stock' | 'crypto' | 'etf' | 'bond'
  value: number
  initialInvestment: number
  quantity: number
  purchasePrice: number
  currentPrice: number
  performance: {
    day: number
    week: number
    month: number
    year: number
  }
  history: {
    date: string
    value: number
  }[]
}

const investments: Investment[] = [
  {
    id: '1',
    name: 'VTSAX',
    type: 'etf',
    value: 25000,
    initialInvestment: 20000,
    quantity: 100,
    purchasePrice: 200,
    currentPrice: 250,
    performance: {
      day: 0.5,
      week: 1.2,
      month: 3.5,
      year: 12.5
    },
    history: [
      { date: '2024-01', value: 22000 },
      { date: '2024-02', value: 23500 },
      { date: '2024-03', value: 25000 }
    ]
  },
  {
    id: '2',
    name: 'Bitcoin',
    type: 'crypto',
    value: 15000,
    initialInvestment: 10000,
    quantity: 0.25,
    purchasePrice: 40000,
    currentPrice: 60000,
    performance: {
      day: -2.1,
      week: 5.5,
      month: 15.2,
      year: 45.8
    },
    history: [
      { date: '2024-01', value: 12000 },
      { date: '2024-02', value: 14000 },
      { date: '2024-03', value: 15000 }
    ]
  }
]

const allocation = [
  { name: 'Stocks', value: 45, color: '#0ea5e9' },
  { name: 'Crypto', value: 25, color: '#f43f5e' },
  { name: 'ETFs', value: 20, color: '#8b5cf6' },
  { name: 'Bonds', value: 10, color: '#10b981' }
]

export function InvestmentPortfolio() {
  const [selectedPeriod, setSelectedPeriod] = useState('1M')

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)
  const totalGain = investments.reduce((sum, inv) => sum + (inv.value - inv.initialInvestment), 0)
  const totalReturn = (totalGain / investments.reduce((sum, inv) => sum + inv.initialInvestment, 0)) * 100

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Portfolio Value
                </p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Return
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalReturn.toFixed(2)}%</p>
                  {totalReturn > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <ChartIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Gain
                </p>
                <p className="text-2xl font-bold">${totalGain.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Asset Allocation
                </p>
                <p className="text-2xl font-bold">{allocation.length}</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <PieChartIcon className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investments[0].history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {allocation.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Investment Holdings</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{investment.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{investment.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {investment.quantity} units @ ${investment.currentPrice}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${investment.value.toLocaleString()}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Badge 
                          variant={investment.performance.month > 0 ? "default" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          {investment.performance.month > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {investment.performance.month}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">30d</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 