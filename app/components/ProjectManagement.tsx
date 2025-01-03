'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

type Task = {
  id: string
  title: string
  description: string
  status: 'todo' | 'inProgress' | 'done'
}

type Project = {
  id: string
  name: string
  tasks: Task[]
}

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      tasks: [
        { id: '1', title: 'Design mockups', description: 'Create initial design mockups', status: 'inProgress' },
        { id: '2', title: 'Frontend development', description: 'Implement the new design', status: 'todo' },
        { id: '3', title: 'User testing', description: 'Conduct user testing sessions', status: 'todo' },
      ]
    }
  ])
  const [newProject, setNewProject] = useState({ name: '' })
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' })

  const addProject = () => {
    if (newProject.name) {
      setProjects([...projects, { id: Date.now().toString(), name: newProject.name, tasks: [] }])
      setNewProject({ name: '' })
    }
  }

  const addTask = () => {
    if (newTask.title && newTask.projectId) {
      setProjects(projects.map(project => 
        project.id === newTask.projectId
          ? { ...project, tasks: [...project.tasks, { ...newTask, id: Date.now().toString(), status: 'todo' }] }
          : project
      ))
      setNewTask({ title: '', description: '', projectId: '' })
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const projectId = source.droppableId.split('-')[1]
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const tasks = Array.from(project.tasks)
        const [reorderedTask] = tasks.splice(source.index, 1)
        tasks.splice(destination.index, 0, { ...reorderedTask, status: destination.droppableId as Task['status'] })
        return { ...project, tasks }
      }
      return project
    })
    setProjects(updatedProjects)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-project">New Project</Label>
          <div className="flex space-x-2">
            <Input
              id="new-project"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ name: e.target.value })}
            />
            <Button onClick={addProject}>Add Project</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-task">New Task</Label>
          <Input
            id="new-task"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Select value={newTask.projectId} onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addTask} className="w-full">Add Task</Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {projects.map(project => (
            <div key={project.id} className="mt-4">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['todo', 'inProgress', 'done'] as const).map(status => (
                  <Droppable key={status} droppableId={status}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-100 p-2 rounded-md"
                      >
                        <h4 className="font-medium mb-2">{status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : 'Done'}</h4>
                        {project.tasks.filter(task => task.status === status).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-2 mb-2 rounded shadow"
                              >
                                <h5 className="font-medium">{task.title}</h5>
                                <p className="text-sm text-gray-600">{task.description}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          ))}
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

