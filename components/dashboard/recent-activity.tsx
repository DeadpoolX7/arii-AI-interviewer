import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import type { InterviewSession } from "@/types/interview"

interface RecentActivityProps {
  interviews: InterviewSession[]
}

export const RecentActivity = ({ interviews }: RecentActivityProps) => {
  // Get last 5 completed interviews
  const recentInterviews = interviews.filter((interview) => interview.status === "completed").slice(0, 5)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getScoreTrend = (currentScore: number, previousScore?: number) => {
    if (!previousScore) return null
    if (currentScore > previousScore) return "up"
    if (currentScore < previousScore) return "down"
    return "same"
  }

  if (recentInterviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interview activity</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interview activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInterviews.map((interview, index) => {
            const previousInterview = recentInterviews[index + 1]
            const trend = interview.overallScore
              ? getScoreTrend(interview.overallScore, previousInterview?.overallScore)
              : null

            return (
              <div key={interview.sessionId} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{interview.role}</span>
                    {interview.overallScore && (
                      <Badge variant="outline" className="text-xs">
                        {interview.overallScore.toFixed(1)}/10
                      </Badge>
                    )}
                    {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(interview.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
