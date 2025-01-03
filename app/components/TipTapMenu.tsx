import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react'

type TipTapMenuProps = {
  editor: Editor | null
}

export function TipTapMenu({ editor }: TipTapMenuProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex space-x-2 mb-2">
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'secondary' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('italic') ? 'secondary' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('bulletList') ? 'secondary' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('orderedList') ? 'secondary' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}

