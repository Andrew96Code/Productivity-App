'use client'

import * as React from 'react'
import { useState } from 'react'
import { Tabs } from '@/components/ui/tabs'

type PromptCategory = 'daily' | 'weekly' | 'monthly'

export function CustomizablePrompts() {
  const [category, setCategory] = useState<PromptCategory>('daily')

  return (
    <Tabs 
      value={category} 
      onValueChange={(value) => setCategory(value as PromptCategory)}
    >
      {/* ... rest of the component */}
    </Tabs>
  )
}

