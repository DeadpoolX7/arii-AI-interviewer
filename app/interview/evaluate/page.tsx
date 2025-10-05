"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { evaluateAnswers } from "@/lib/gemini"

export default function EvaluatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [evaluating, setEvaluating] = useState(false)

  useEffect(() => {
    const evaluateInterview = async () => {
      try {
        const sessionId = sessionStorage.getItem("currentSessionId")
        const answersData = sessionStorage.getItem("interviewAnswers")
        const resumeData = sessionStorage.getItem("resumeData")

        if (!sessionId || !answersData || !resumeData) {
          router.push("/interview/upload")
          return
        }

        const answers = JSON.parse(answersData)
        const { role, questions } = JSON.parse(sessionStorage.getItem("interviewQuestions") || "{}")

        if (!role || !questions) {
          setError("Interview data not found")
          setLoading(false)
          return
        }

        setEvaluating(true)

        // Evaluate answers using Gemini
        const {
          evaluations,
          overallScore,
          overallFeedback,
          error: evalError,
        } = await evaluateAnswers(questions, answers, role)

        if (evalError) {
          setError(evalError)
          setLoading(false)
          return
        }

        // Store results in local storage since Firestore is blocked
        const results = {
          sessionId,
          answers,
          questions,
          role,
          feedback: evaluations.map((evaluation: any) => evaluation.feedback),
          scores: evaluations.map((evaluation: any) => evaluation.score),
          overallScore,
          overallFeedback,
          status: "completed",
          completedAt: new Date().toISOString(),
        }

        // Save to local storage
        const savedInterviews = JSON.parse(localStorage.getItem("savedInterviews") || "[]")
        savedInterviews.push(results)
        localStorage.setItem("savedInterviews", JSON.stringify(savedInterviews))

        // Clean up session storage
        sessionStorage.removeItem("resumeData")
        sessionStorage.removeItem("currentSessionId")
        sessionStorage.removeItem("interviewAnswers")
        sessionStorage.removeItem("interviewQuestions")

        // Redirect to results
        router.push(`/results/${sessionId}`)
      } catch (err: any) {
        setError(err.message || "Failed to evaluate interview")
        setLoading(false)
      }
    }

    evaluateInterview()
  }, [router])

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {evaluating ? "Evaluating Your Answers" : "Processing Interview"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {evaluating
                  ? "Our AI is analyzing your responses and generating detailed feedback..."
                  : "Please wait while we process your interview..."}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Analyzing answer quality</p>
                <p>✓ Generating personalized feedback</p>
                <p>✓ Calculating performance scores</p>
                <p>✓ Preparing improvement suggestions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
