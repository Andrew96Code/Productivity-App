'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2 } from 'lucide-react'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceInterface() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
    setIsListening(!isListening)
  }

  const handleCommand = () => {
    // In a real app, this would process the command and generate a response
    // For this example, we'll use a simple switch statement
    let res = ''
    switch (transcript.toLowerCase().trim()) {
      case 'add task':
        res = 'Opening task creation dialog'
        break
      case 'show analytics':
        res = 'Navigating to analytics page'
        break
      case 'start timer':
        res = 'Starting a 25-minute focus timer'
        break
      default:
        res = "I'm sorry, I didn't understand that command"
    }
    setResponse(res)
    speakResponse(res)
  }

  const speakResponse = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(speech)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Voice Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={toggleListening} className="w-full">
            {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          <div className="p-4 bg-gray-100 rounded-md min-h-[100px]">
            <p className="font-semibold">Transcript:</p>
            <p>{transcript}</p>
          </div>
          <Button onClick={handleCommand} disabled={!transcript}>
            Process Command
          </Button>
          {response && (
            <div className="p-4 bg-blue-100 rounded-md">
              <p className="font-semibold">Response:</p>
              <p>{response}</p>
              <Button onClick={() => speakResponse(response)} className="mt-2">
                <Volume2 className="mr-2" /> Speak Response
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

