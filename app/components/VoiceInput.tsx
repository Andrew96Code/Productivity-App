'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mic, MicOff } from 'lucide-react'

type VoiceInputProps = {
  onAddTask: (task: { title: string; description: string }) => void
}

export function VoiceInput({ onAddTask }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = () => {
    setIsListening(true)
    setTranscript('')

    // In a real implementation, we would use the Web Speech API here
    // For this example, we'll simulate voice input
    setTimeout(() => {
      setTranscript('Remember to buy groceries')
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleAddTask = () => {
    if (transcript) {
      onAddTask({
        title: transcript,
        description: 'Task added via voice input'
      })
      setTranscript('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Input</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          {transcript && (
            <>
              <p className="text-center">{transcript}</p>
              <Button onClick={handleAddTask}>Add Task</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

