"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResultsSummary } from "@/components/results/results-summary"
import { QuestionResult } from "@/components/results/question-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getInterviewSession } from "@/lib/firestore"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ResultsPageProps {
  params: {
    sessionId: string
  }
}

function ResultsContent({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Try to get data from local storage first
        const savedInterviews = JSON.parse(localStorage.getItem("savedInterviews") || "[]")
        const localSession = savedInterviews.find((s: any) => s.sessionId === sessionId)

        if (localSession) {
          setSession({
            ...localSession,
            completedAt: new Date(localSession.completedAt)
          })
          setLoading(false)
          return
        }

        // If not in local storage, try Firestore
        const { session: firestoreSession, error } = await getInterviewSession(sessionId)
        if (error || !firestoreSession || firestoreSession.status !== "completed") {
          throw new Error(error || "Session not found")
        }

        setSession(firestoreSession)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [sessionId])

  if (loading) {
    return <LoadingResults />
  }

  if (error || !session) {
    return notFound()
  }

  // Calculate averages
  const technicalScores = session.scores.filter((_, index) => session.questions[index].type === "technical")
  const behavioralScores = session.scores.filter((_, index) => session.questions[index].type === "behavioral")

  const technicalAverage =
    technicalScores.length > 0 ? technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length : 0

  const behavioralAverage =
    behavioralScores.length > 0 ? behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <ResultsSummary
        overallScore={session.overallScore || 0}
        technicalAverage={technicalAverage}
        behavioralAverage={behavioralAverage}
        role={session.role}
        completedAt={session.completedAt || new Date()}
        totalQuestions={session.questions.length}
        overallFeedback={session.feedback[session.feedback.length - 1] || "No overall feedback available"}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Question-by-Question Results</h2>
        {session.questions.map((question, index) => (
          <QuestionResult
            key={question.id}
            question={question.question}
            answer={session.answers[index] || "No answer provided"}
            feedback={session.feedback[index] || "No feedback available"}
            score={session.scores[index] || 0}
            type={question.type}
            questionNumber={index + 1}
          />
        ))}
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Ready for Another Interview?</h3>
          <p className="text-muted-foreground mb-4">
            Practice makes perfect! Try another interview to improve your skills.
          </p>
          <Link href="/interview/upload">
            <Button>Start New Interview</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingResults() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="h-48 bg-muted rounded animate-pulse" />
    </div>
  )
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ResultsContent sessionId={params.sessionId} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
