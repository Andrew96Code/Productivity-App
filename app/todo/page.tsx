'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2, Circle, Clock, Flag, MoreHorizontal, Plus, Search, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PomodoroTimer } from '../components/PomodoroTimer'
import { TaskChart } from '../components/TaskChart'
import { AITaskSuggestions } from '../components/AITaskSuggestions'
import { EisenhowerMatrix } from '../components/EisenhowerMatrix'
import { ProductivityInsights } from '../components/ProductivityInsights'
import { CollaborationPanel } from '../components/CollaborationPanel'
import { VoiceInput } from '../components/VoiceInput'
import { TaskDetailsModal } from '../components/TaskDetailsModal'
import { Task, TaskCategory } from '../types/task'
import { TaskItem } from '../components/TaskItem'

export default function TodoPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: new Date(),
    estimatedTime: 30,
    category: 'Important & Urgent' as TaskCategory,
    tags: [],
    timeSpent: 0,
    completed: false
  })
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('dueDate')
  const [showCompleted, setShowCompleted] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [view, setView] = useState<'list' | 'eisenhower'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks, (key, value) => {
        if (key === 'dueDate') return new Date(value)
        return value
      }))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task: Partial<Task>) => {
    const newTaskWithId = { ...task, id: Date.now().toString() } as Task
    setTasks([...tasks, newTaskWithId])
    toast({
      title: "Task Added",
      description: "Your new task has been successfully added.",
    })
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    toast({
      title: "Task Updated",
      description: "Your task has been successfully updated.",
    })
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast({
      title: "Task Deleted",
      description: "Your task has been successfully deleted.",
    })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const newTasks = Array.from(tasks)
    const [reorderedTask] = newTasks.splice(result.source.index, 1)
    newTasks.splice(result.destination.index, 0, reorderedTask)

    setTasks(newTasks)
  }

  const startTimer = (task: Task) => {
    setActiveTask(task)
    setIsTimerRunning(true)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    if (activeTask) {
      const updatedTask = { ...activeTask, timeSpent: activeTask.timeSpent + 25 * 60 } // Add 25 minutes
      updateTask(updatedTask)
      setActiveTask(null)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.status === 'Done') return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filter === 'all') return true
    if (filter === 'high') return task.priority === 'High'
    if (filter === 'medium') return task.priority === 'Medium'
    if (filter === 'low') return task.priority === 'Low'
    if (filter.startsWith('tag:')) return task.tags.includes(filter.slice(4))
    return task.category === filter
  }).sort((a, b) => {
    if (sort === 'dueDate') return a.dueDate.getTime() - b.dueDate.getTime()
    if (sort === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sort === 'estimatedTime') return b.estimatedTime - a.estimatedTime
    return 0
  })

  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)))

  const openTaskDetailsModal = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailsModalOpen(true)
  }

  const closeTaskDetailsModal = () => {
    setSelectedTask(null)
    setIsTaskDetailsModalOpen(false)
  }

  const quickAddTask = () => {
    if (newTask.title) {
      addTask({
        ...newTask,
        description: newTask.description || '',
        category: newTask.category as TaskCategory,
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        dueDate: new Date(),
        estimatedTime: 30,
        category: 'Important & Urgent' as TaskCategory,
        tags: [],
        timeSpent: 0,
        completed: false
      })
      setShowQuickAdd(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Ultimate To-Do List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="Important & Urgent">Important & Urgent</SelectItem>
                    <SelectItem value="Important & Not Urgent">Important & Not Urgent</SelectItem>
                    <SelectItem value="Not Important & Urgent">Not Important & Urgent</SelectItem>
                    <SelectItem value="Not Important & Not Urgent">Not Important & Not Urgent</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={`tag:${tag}`}>Tag: {tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="estimatedTime">Estimated Time</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label htmlFor="show-completed">Show Completed</Label>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setView(view === 'list' ? 'eisenhower' : 'list')}>
                {view === 'list' ? 'Eisenhower Matrix' : 'List View'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'list' ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <ScrollArea className="h-[600px] pr-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                key={task.id}
                                task={task}
                                onUpdate={updateTask}
                                onDelete={deleteTask}
                                onStartTimer={startTimer}
                                onOpenDetails={openTaskDetailsModal}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ScrollArea>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <EisenhowerMatrix 
                tasks={tasks} 
                onUpdateTask={updateTask}
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Button onClick={quickAddTask}>Add</Button>
              </div>
              {showQuickAdd && (
                <div className="mt-4 space-y-4">
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTask.dueDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                  />
                </div>
              )}
              <Button variant="link" onClick={() => setShowQuickAdd(!showQuickAdd)} className="mt-2">
                {showQuickAdd ? 'Hide' : 'Show'} more options
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="timer">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="voice">Voice Input</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="timer">
              <PomodoroTimer
                isRunning={isTimerRunning}
                onStart={() => setIsTimerRunning(true)}
                onStop={stopTimer}
              />
            </TabsContent>
            <TabsContent value="voice">
              <VoiceInput onAddTask={addTask} />
            </TabsContent>
            <TabsContent value="ai">
              <AITaskSuggestions tasks={tasks} onAddTask={addTask} />
            </TabsContent>
          </Tabs>

          <TaskChart tasks={tasks} />

          <ProductivityInsights tasks={tasks} />

          <CollaborationPanel 
            tasks={tasks} 
            onUpdateTask={updateTask}
          />
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isTaskDetailsModalOpen}
        onClose={closeTaskDetailsModal}
        onUpdate={updateTask}
      />
    </div>
  )
}

