'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Note = {
  id: string
  title: string
  content: string
  tags: string[]
}

export function NoteTakingTool() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' })
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags.split(',').map(tag => tag.trim()),
      }
      setNotes([...notes, note])
      setNewNote({ title: '', content: '', tags: '' })
    }
  }

  const updateNote = () => {
    if (selectedNote) {
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? selectedNote : note
      ))
      setSelectedNote(null)
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Note Taking Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {selectedNote ? 'Edit Note' : 'Add New Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={selectedNote ? selectedNote.title : newNote.title}
                  onChange={(e) => selectedNote
                    ? setSelectedNote({ ...selectedNote, title: e.target.value })
                    : setNewNote({ ...newNote, title: e.target.value })
                  }
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={selectedNote ? selectedNote.content : newNote.content}
                  onChange={(e) => selectedNote
                    ? setSelectedNote({ ...selectedNote, content: e.target.value })
                    : setNewNote({ ...newNote, content: e.target.value })
                  }
                  placeholder="Enter note content"
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="note-tags">Tags (comma-separated)</Label>
                <Input
                  id="note-tags"
                  value={selectedNote ? selectedNote.tags.join(', ') : newNote.tags}
                  onChange={(e) => selectedNote
                    ? setSelectedNote({ ...selectedNote, tags: e.target.value.split(',').map(tag => tag.trim()) })
                    : setNewNote({ ...newNote, tags: e.target.value })
                  }
                  placeholder="Enter tags"
                />
              </div>
              <Button onClick={selectedNote ? updateNote : addNote}>
                {selectedNote ? 'Update Note' : 'Add Note'}
              </Button>
              {selectedNote && (
                <Button variant="outline" onClick={() => setSelectedNote(null)}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Notes</h3>
            <div className="space-y-4">
              {notes.map(note => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{note.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{note.content.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedNote(note)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteNote(note.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

