'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Task = {
  id: string
  title: string
  x: number
  y: number
}

export function ARTaskVisualization() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        tasks.forEach(task => {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
          ctx.fillRect(task.x - 50, task.y - 25, 100, 50)
          ctx.fillStyle = 'white'
          ctx.font = '14px Arial'
          ctx.fillText(task.title, task.x - 45, task.y + 5, 90)
        })
      }
    }
  }, [tasks])

  const addTask = () => {
    if (newTask.trim() && canvasRef.current) {
      const canvas = canvasRef.current
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          x: Math.random() * (canvas.width - 100) + 50,
          y: Math.random() * (canvas.height - 50) + 25,
        },
      ])
      setNewTask('')
    }
  }

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AR Task Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newTask}
              onChange={handleTaskNameChange}
              placeholder="Enter a new task"
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border border-gray-300 rounded-md"
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <p className="text-gray-400">AR View Simulation</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            This is a simulated AR view. In a real app, this would use your device's camera and AR capabilities to place tasks in your physical environment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

