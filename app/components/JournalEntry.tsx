import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type JournalEntryProps = {
  date: Date
  type: 'daily' | 'weekly' | 'monthly'
  content: string
  mood?: string
}

export default function JournalEntry({ date, type, content, mood }: JournalEntryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{date.toLocaleDateString()}</CardTitle>
        <CardDescription>{type.charAt(0).toUpperCase() + type.slice(1)} Entry</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{content}</p>
        {mood && <p className="text-sm text-gray-500">Mood: {mood}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="outline">Edit</Button>
      </CardFooter>
    </Card>
  )
}

