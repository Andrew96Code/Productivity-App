'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Settings } from 'lucide-react'
import { JournalSearch } from './dashboard/JournalSearch'
import { MoodAnalysis } from './dashboard/MoodAnalysis'
import { JournalStreak } from './dashboard/JournalStreak'

interface Widget {
  id: string
  title: string
  enabled: boolean
  component: React.ReactNode
}

export function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'journal-search', title: 'Journal Search', enabled: true, component: <JournalSearch /> },
    { id: 'mood-analysis', title: 'Mood Analysis', enabled: true, component: <MoodAnalysis /> },
    { id: 'journal-streak', title: 'Journal Streak', enabled: true, component: <JournalStreak /> },
  ])
  const [isCustomizing, setIsCustomizing] = useState(false)

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout')
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(widgets))
  }, [widgets])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setWidgets(items)
  }

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <Button onClick={() => setIsCustomizing(!isCustomizing)}>
          <Settings className="mr-2 h-4 w-4" />
          {isCustomizing ? 'Save Layout' : 'Customize Dashboard'}
        </Button>
      </div>

      {isCustomizing && (
        <Card>
          <CardHeader>
            <CardTitle>Customize Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={widget.id}
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <Label htmlFor={widget.id}>{widget.title}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {widget.enabled && widget.component}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

