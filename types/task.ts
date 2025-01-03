export interface Task {
  assignedTo: ReactNode
  assignedTo: unknown
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'Low' | 'Medium' | 'High'
  dueDate?: Date
  tags: string[]
  status: 'Todo' | 'In Progress' | 'Done'
  timeSpent: number
  category: string
  estimatedTime?: number
} 