import JournalEntry from './JournalEntry'

type JournalEntryData = {
  id: number
  date: Date
  type: 'daily' | 'weekly' | 'monthly'
  content: string
  mood?: string
}

type JournalListProps = {
  entries: JournalEntryData[]
}

export default function JournalList({ entries }: JournalListProps) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntry
          key={entry.id}
          date={entry.date}
          type={entry.type}
          content={entry.content}
          mood={entry.mood}
        />
      ))}
    </div>
  )
}

