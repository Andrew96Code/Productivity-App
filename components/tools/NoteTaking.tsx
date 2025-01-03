'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, Search, Tag, Folder, 
  Save, Image as ImageIcon, Link, 
  MoreVertical, Star, Clock 
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  folder: string
  createdAt: Date
  updatedAt: Date
  starred: boolean
}

export function NoteTaking() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newTag, setNewTag] = useState('')

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      folder: 'General',
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false
    }
    setNotes([...notes, newNote])
    setCurrentNote(newNote)
  }

  const updateNote = (updates: Partial<Note>) => {
    if (!currentNote) return

    const updatedNote = {
      ...currentNote,
      ...updates,
      updatedAt: new Date()
    }

    setNotes(notes.map(note => 
      note.id === currentNote.id ? updatedNote : note
    ))
    setCurrentNote(updatedNote)
  }

  const addTag = () => {
    if (!currentNote || !newTag.trim()) return
    if (!currentNote.tags.includes(newTag)) {
      updateNote({
        tags: [...currentNote.tags, newTag]
      })
    }
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    if (!currentNote) return
    updateNote({
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const toggleStar = () => {
    if (!currentNote) return
    updateNote({ starred: !currentNote.starred })
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <Button className="w-full" onClick={createNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      currentNote?.id === note.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setCurrentNote(note)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      {note.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {note.content.substring(0, 50)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {note.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      <div className="col-span-9">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Input
                value={currentNote?.title || ''}
                onChange={(e) => updateNote({ title: e.target.value })}
                placeholder="Note title..."
                className="text-xl font-semibold bg-transparent border-0 p-0 focus-visible:ring-0"
                disabled={!currentNote}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!currentNote}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline" size="sm" disabled={!currentNote}>
                  <Link className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!currentNote}
                  onClick={toggleStar}
                >
                  <Star
                    className={`h-4 w-4 ${
                      currentNote?.starred ? 'fill-current text-yellow-500' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={currentNote?.content || ''}
              onChange={(e) => updateNote({ content: e.target.value })}
              placeholder="Start writing..."
              className="min-h-[400px] resize-none"
              disabled={!currentNote}
            />

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 flex flex-wrap gap-2">
                {currentNote?.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="w-24 h-6 text-sm"
                  disabled={!currentNote}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {currentNote?.folder}
              </div>
              <div>
                Last updated: {currentNote?.updatedAt.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 