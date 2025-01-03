'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function AIOptimizer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Let AI help you optimize your task schedule and improve productivity.
          </p>
          <Button className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Optimize Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 