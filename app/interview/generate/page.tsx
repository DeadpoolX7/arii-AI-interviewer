"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RoleSelector } from "@/components/interview/role-selector"
import { QuestionDisplay } from "@/components/interview/question-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { generateInterviewQuestions } from "@/lib/gemini"
import { createInterviewSession } from "@/lib/firestore"
import { useAuth } from "@/contexts/auth-context"
import type { InterviewQuestion } from "@/types/interview"

export default function GeneratePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [resumeData, setResumeData] = useState<{
    text: string
    fileName: string
    downloadURL: string
  } | null>(null)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"configure" | "interview">("configure")

  useEffect(() => {
    // Get resume data from sessionStorage
    const storedData = sessionStorage.getItem("resumeData")
    if (storedData) {
      setResumeData(JSON.parse(storedData))
    } else {
      // Redirect back to upload if no resume data
      router.push("/interview/upload")
    }
  }, [router])

  const handleGenerateQuestions = async (role: string, technicalCount: number, behavioralCount: number) => {
    if (!resumeData || !user) return

    setLoading(true)
    setError("")

    try {
      const { questions: generatedQuestions, error: genError } = await generateInterviewQuestions(
        resumeData.text,
        role,
        technicalCount,
        behavioralCount,
      )

      if (genError) {
        setError(genError)
        return
      }

      // Create interview session in Firestore
      const { sessionId, error: sessionError, isLocal } = await createInterviewSession({
        userId: user.uid,
        role,
        resumeText: resumeData.text,
        resumeFileName: resumeData.fileName,
        questions: generatedQuestions,
        answers: [],
        feedback: [],
        scores: [],
        status: "in-progress",
      })

      if (sessionError || !sessionId) {
        setError(sessionError || "Failed to create interview session")
        return
      }

      // Store the session type
      if (isLocal) {
        sessionStorage.setItem('isLocalSession', 'true');
      }

      // Store session ID for later use
      sessionStorage.setItem("currentSessionId", sessionId)

      // After generating questions successfully
      sessionStorage.setItem("interviewQuestions", JSON.stringify({
        role,
        questions: generatedQuestions
      }))
      setQuestions(generatedQuestions)
      setStep("interview")
    } catch (err: any) {
      setError(err.message || "Failed to generate questions")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswers = async (answers: string[]) => {
    const sessionId = sessionStorage.getItem("currentSessionId")
    if (!sessionId) {
      setError("Session not found")
      return
    }

    // Store answers in sessionStorage and redirect to evaluation
    sessionStorage.setItem("interviewAnswers", JSON.stringify(answers))
    router.push("/interview/evaluate")
  }

  const goBack = () => {
    if (step === "interview") {
      setStep("configure")
    } else {
      router.push("/interview/upload")
    }
  }

  if (!resumeData) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center">
              <p className="text-muted-foreground">Loading resume data...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={goBack} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              {step === "configure" ? "Configure Interview" : "Interview Questions"}
            </h1>
            <p className="text-muted-foreground">
              {step === "configure"
                ? "Set up your interview preferences and generate questions."
                : "Answer each question thoughtfully. Take your time."}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "configure" ? (
            <RoleSelector onSubmit={handleGenerateQuestions} loading={loading} />
          ) : (
            <QuestionDisplay questions={questions} onSubmitAnswers={handleSubmitAnswers} loading={loading} />
          )}

          {step === "configure" && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold mb-3">Resume Summary</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>File:</strong> {resumeData.fileName}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Content Preview:</strong> {resumeData.text.substring(0, 200)}...
              </p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
