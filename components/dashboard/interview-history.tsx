"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Briefcase, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { InterviewSession } from "@/types/interview"

interface InterviewHistoryProps {
  interviews: InterviewSession[]
}

export const InterviewHistory = ({ interviews }: InterviewHistoryProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
          <CardDescription>Your completed interviews will appear here</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No interviews yet</p>
          </div>
          <Link href="/interview/upload">
            <Button>Start Your First Interview</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview History</CardTitle>
        <CardDescription>Review your past interview performances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview.sessionId}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-foreground">{interview.role}</h3>
                  <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                  {interview.overallScore && (
                    <Badge className={getScoreColor(interview.overallScore)}>
                      {interview.overallScore.toFixed(1)}/10
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(interview.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{interview.questions.length} questions</span>
                  </div>
                  {interview.overallScore && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Score: {interview.overallScore.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {interview.status === "completed" && (
                  <Link href={`/results/${interview.sessionId}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </Link>
                )}
                {interview.status === "in-progress" && (
                  <Link href="/interview/generate">
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
