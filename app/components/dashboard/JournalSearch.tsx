'use client'

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function JournalSearch() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Search your journal entries..." />
      </CardContent>
    </Card>
  )
} 