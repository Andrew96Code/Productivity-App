'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mic, MicOff, Send, Settings2, Languages, Volume2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'system'
  content: string
  timestamp: Date
}

export function VoiceInterface() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')

  // Simulated speech recognition
  useEffect(() => {
    if (!isListening) return

    // In a real implementation, we would use the Web Speech API
    const timer = setTimeout(() => {
      setTranscript('Simulated voice input...')
    }, 1000)

    return () => clearTimeout(timer)
  }, [isListening])

  const handleStartListening = () => {
    setIsListening(true)
    // Request microphone permission and start recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Initialize speech recognition
    }
  }

  const handleStopListening = () => {
    setIsListening(false)
    if (transcript) {
      addMessage('user', transcript)
      processCommand(transcript)
      setTranscript('')
    }
  }

  const addMessage = (type: 'user' | 'system', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }])
  }

  const processCommand = (command: string) => {
    // Simple command processing simulation
    const response = `Processing command: "${command}"`
    addMessage('system', response)
    speakResponse(response)
  }

  const speakResponse = (text: string) => {
    // Text-to-speech implementation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Voice Interface</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                {selectedLanguage}
              </Button>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Display */}
          <ScrollArea className="h-[400px] p-4 border rounded-lg">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Voice Input Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
              onClick={isListening ? handleStopListening : handleStartListening}
            >
              {isListening ? (
                <><MicOff className="mr-2" /> Stop Listening</>
              ) : (
                <><Mic className="mr-2" /> Start Listening</>
              )}
            </Button>
            <div className="flex-1">
              <Input
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Transcript will appear here..."
                disabled={isListening}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={!transcript}
              onClick={() => handleStopListening()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Status and Info */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant={isListening ? 'default' : 'secondary'}>
                {isListening ? 'Listening...' : 'Ready'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Voice feedback enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 