"use client"

import { useRef, useState, useEffect } from "react"
import { FaMicrophone, FaPause } from "react-icons/fa";

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [transcript, setTranscript] = useState("")

  const recognitionRef = useRef(null)

  const startRecording = () => {
    setIsRecording(true)

      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
  
      recognitionRef.current.onresult = (event: any) => {
        const { transcript } = event.results[event.results.length -1][0]
        setTranscript(transcript)
      }
  
      recognitionRef.current.start()

  }

  useEffect(() => {
    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])
  
  const stopRecording = () => {
    if(recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setRecordingComplete(true)
    }
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">

      { /* transcript section */}

      <div className="w-full">
        {(isRecording || transcript) && (
          <div className="w-1/4 m-auto rounded-md border p-4 bg-white">
            <div className="flex-1 flex w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {recordingComplete ? "Recorded" : "Recording"}
                </p>
                <p className="text-sm ">
                  {recordingComplete ? "Thanks for talking" : "Start speaking..."}
                </p>
              </div>

              {isRecording && (
                <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
              )}

            </div>

            {transcript && (
              <div className="border rounded-md p2 mt-4">
                <p className="mb-0">{transcript}</p>
              </div>
            )}

          </div>
        )}

        {/* Buttons Section */}
        <div className="flex items-center w-full">
          {isRecording ? (
            <button
              onClick={handleToggleRecording}
              className="mt-10 m-auto p-4 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500"
            >
              <FaPause size={20} color="#ffffff" />
            </button>
          ) : (
            <button
              onClick={handleToggleRecording}
              className="mt-10 m-auto p-4 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500"
            >
              <FaMicrophone size={20} color="#ffffff" />

            </button>
          )}
        </div>


      </div>
    </div>
  )
}

export default SpeechToText
