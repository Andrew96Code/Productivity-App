'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'

type BiometricData = {
  timestamp: string
  heartRate: number
  stress: number
  sleep: number
}

export function BiometricDataIntegration() {
  const [biometricData, setBiometricData] = useState<BiometricData[]>([])

  useEffect(() => {
    // Simulate initial data
    generateData()
  }, [])

  const generateData = () => {
    const newData: BiometricData[] = []
    const now = new Date()
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      newData.push({
        timestamp: timestamp.toLocaleTimeString(),
        heartRate: Math.floor(Math.random() * (80 - 60 + 1) + 60),
        stress: Math.floor(Math.random() * 100),
        sleep: i % 24 < 8 ? Math.random() * 100 : 0, // Simulate sleep during night hours
      })
    }
    setBiometricData(newData)
  }

  const syncData = () => {
    // In a real app, this would fetch data from a wearable device or health app
    // For this example, we'll just regenerate random data
    generateData()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Biometric Data Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={syncData} className="mb-4">Sync Biometric Data</Button>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={biometricData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" name="Heart Rate (bpm)" />
            <Line type="monotone" dataKey="stress" stroke="#82ca9d" name="Stress Level" />
            <Line type="monotone" dataKey="sleep" stroke="#ffc658" name="Sleep Quality" />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-gray-500">
          This chart shows simulated biometric data. In a real app, this would display actual data from your wearable devices or health apps.
        </p>
      </CardContent>
    </Card>
  )
}

