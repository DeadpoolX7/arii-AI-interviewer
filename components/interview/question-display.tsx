"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Send } from "lucide-react"
import type { InterviewQuestion } from "@/types/interview"

interface QuestionDisplayProps {
  questions: InterviewQuestion[]
  onSubmitAnswers: (answers: string[]) => void
  loading?: boolean
}

export const QuestionDisplay = ({ questions, onSubmitAnswers, loading = false }: QuestionDisplayProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""))

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    onSubmitAnswers(answers)
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canSubmit = answers.every((answer) => answer.trim().length > 0)

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No questions available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview Questions</h2>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <Badge variant={currentQuestion.type === "technical" ? "default" : "secondary"}>{currentQuestion.type}</Badge>
      </div>

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
          <CardDescription>
            Take your time to provide a thoughtful answer. You can navigate between questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-foreground font-medium leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Answer</label>
            <Textarea
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px]"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">{answers[currentQuestionIndex].length} characters</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPrevious} disabled={currentQuestionIndex === 0 || loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={loading}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : answers[index].trim()
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!canSubmit || loading} size="lg">
            {loading ? "Submitting..." : "Submit Interview"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={goToNext} disabled={currentQuestionIndex === questions.length - 1 || loading}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {!canSubmit && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Please answer all questions before submitting your interview.
          </p>
        </div>
      )}
    </div>
  )
}
