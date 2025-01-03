'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function DataExport() {
  const [exportFormat, setExportFormat] = useState('csv')
  const [dateRange, setDateRange] = useState('last30days')

  const handleExport = () => {
    // In a real app, this would trigger the data export process
    console.log(`Exporting data in ${exportFormat} format for ${dateRange}`)
    // You would typically make an API call here to generate and download the export file
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700">
              Export Format
            </label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="exportFormat">
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="allTime">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport}>Export Data</Button>
        </div>
      </CardContent>
    </Card>
  )
}

