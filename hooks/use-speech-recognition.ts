import { useEffect, useState } from "react"

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("SpeechRecognition not supported in this browser")
      return
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognizer = new SpeechRecognition()
    recognizer.continuous = true
    recognizer.interimResults = true
    recognizer.lang = "en-US"

    recognizer.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript
      }
      onResult(transcript)
    }

    recognizer.onstart = () => setListening(true)
    recognizer.onend = () => setListening(false)

    if (listening) recognizer.start()
    else recognizer.stop()

    return () => {
      recognizer.stop()
    }
  }, [listening, onResult])

  return { listening, toggle: () => setListening((l) => !l) }
}