'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Trophy, Timer } from 'lucide-react'

interface PrizeDraw {
  id: string
  title: string
  description: string
  prize: string
  points_required: number
  status: string
  end_date: string
}

export function PrizeDraws() {
  const [draws, setDraws] = useState<PrizeDraw[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [selectedDraw, setSelectedDraw] = useState<PrizeDraw | null>(null)
  const [ticketCount, setTicketCount] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadPrizeDraws()
  }, [])

  const loadPrizeDraws = async () => {
    try {
      const [drawsResponse, pointsResponse] = await Promise.all([
        fetch('/api/prize-draw/draws'),
        fetch('/api/points/total')
      ])

      if (drawsResponse.ok && pointsResponse.ok) {
        const drawsData = await drawsResponse.json()
        const pointsData = await pointsResponse.json()
        setDraws(drawsData.data || [])
        setUserPoints(pointsData.total_points || 0)
      }
    } catch (error) {
      console.error('Error loading prize draws:', error)
    }
  }

  const getTimeLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return 'Ending soon'
    }
  }

  const handleEnterDraw = async () => {
    if (!selectedDraw) return

    try {
      const response = await fetch(`/api/prize-draw/draws/${selectedDraw.id}/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: ticketCount })
      })

      if (response.ok) {
        setIsDialogOpen(false)
        loadPrizeDraws()
        // Show success message
      } else {
        const data = await response.json()
        // Show error message
      }
    } catch (error) {
      console.error('Error entering draw:', error)
      // Show error message
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Prize Draws</h2>
          <p className="text-muted-foreground">Enter draws to win exciting prizes</p>
        </div>
        <Badge variant="secondary" className="text-lg">
          {userPoints} Points
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draws.map((draw) => (
          <Card key={draw.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{draw.title}</CardTitle>
                <Badge variant="outline">
                  {draw.points_required} points/ticket
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{draw.description}</p>
                
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{draw.prize}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>Ends in: {getTimeLeft(draw.end_date)}</span>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedDraw(draw)
                    setTicketCount(1)
                    setIsDialogOpen(true)
                  }}
                >
                  Enter Draw
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Prize Draw</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedDraw && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedDraw.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDraw.prize}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Tickets</label>
                  <Input
                    type="number"
                    min={1}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Points required: {selectedDraw.points_required * ticketCount}
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEnterDraw}>
                    Enter Draw
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 