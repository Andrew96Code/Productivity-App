export type TaskCategory = 'Important & Urgent' | 'Important & Not Urgent' | 'Not Important & Urgent' | 'Not Important & Not Urgent'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'Low' | 'Medium' | 'High'
  dueDate: Date
  tags: string[]
  status: 'Todo' | 'In Progress' | 'Done'
  timeSpent: number
  category: TaskCategory
  estimatedTime: number
  assignedTo?: string
  collaborator?: string
} 