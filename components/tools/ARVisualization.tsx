'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Camera, Plus, Move3d, Layers, Focus, RotateCw } from 'lucide-react'

interface ARTask {
  id: string
  title: string
  x: number
  y: number
  z: number
  rotation: number
  scale: number
}

export function ARVisualization() {
  const [tasks, setTasks] = useState<ARTask[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw simulated AR environment
        drawAREnvironment(ctx)

        // Draw tasks
        tasks.forEach(task => {
          drawTask(ctx, task)
        })
      }
    }
  }, [tasks])

  const drawAREnvironment = (ctx: CanvasRenderingContext2D) => {
    // Draw grid to simulate 3D space
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    for (let i = 0; i < 600; i += 50) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 400)
      ctx.moveTo(0, i)
      ctx.lineTo(600, i)
    }
    ctx.stroke()
  }

  const drawTask = (ctx: CanvasRenderingContext2D, task: ARTask) => {
    ctx.save()
    ctx.translate(task.x, task.y)
    ctx.rotate(task.rotation)
    ctx.scale(task.scale, task.scale)

    // Draw task card
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
    ctx.fillRect(-50, -25, 100, 50)
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.fillText(task.title, -45, 5, 90)

    ctx.restore()
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: ARTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        z: Math.random() * 100,
        rotation: Math.random() * Math.PI / 4 - Math.PI / 8,
        scale: 0.8 + Math.random() * 0.4
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on a task
    tasks.forEach(task => {
      const dx = x - task.x
      const dy = y - task.y
      if (dx * dx + dy * dy < 2500) { // 50px radius
        // Handle task selection/manipulation
        console.log('Selected task:', task.title)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AR Task Visualization</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={isCameraActive ? "destructive" : "outline"}
                onClick={() => setIsCameraActive(!isCameraActive)}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isCameraActive ? 'Stop Camera' : 'Start Camera'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AR View */}
          <div className="relative rounded-lg overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onClick={handleCanvasClick}
              className="w-full border border-gray-700"
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white">Camera feed will appear here</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            </div>
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Tools */}
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">
              <Move3d className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layer
            </Button>
            <Button variant="outline" size="sm">
              <Focus className="h-4 w-4 mr-2" />
              Focus
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <span>{task.title}</span>
                <Badge variant="secondary">
                  {`x: ${Math.round(task.x)}, y: ${Math.round(task.y)}`}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 