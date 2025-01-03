'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function JournalSearch() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchTerm)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Journals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

