'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Download, Upload } from 'lucide-react'

export function DataManagement() {
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleExport = () => {
    const data = {
      goals: JSON.parse(localStorage.getItem('goals') || '[]'),
      habits: JSON.parse(localStorage.getItem('habits') || '[]'),
      skills: JSON.parse(localStorage.getItem('skills') || '[]'),
      reflections: JSON.parse(localStorage.getItem('reflections') || '[]'),
      notificationSettings: JSON.parse(localStorage.getItem('notificationSettings') || '[]'),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'productivity_data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          localStorage.setItem('goals', JSON.stringify(data.goals || []))
          localStorage.setItem('habits', JSON.stringify(data.habits || []))
          localStorage.setItem('skills', JSON.stringify(data.skills || []))
          localStorage.setItem('reflections', JSON.stringify(data.reflections || []))
          localStorage.setItem('notificationSettings', JSON.stringify(data.notificationSettings || []))
          alert('Data imported successfully!')
          window.location.reload()
        } catch (error) {
          console.error('Error importing data:', error)
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(importFile)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="import-file">Import Data</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleImport} disabled={!importFile}>
                <Upload className="mr-2 h-4 w-4" /> Import
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

