import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreCard } from "./score-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Briefcase } from "lucide-react"

interface ResultsSummaryProps {
  overallScore: number
  technicalAverage: number
  behavioralAverage: number
  role: string
  completedAt: Date
  totalQuestions: number
  overallFeedback: string
}

export const ResultsSummary = ({
  overallScore,
  technicalAverage,
  behavioralAverage,
  role,
  completedAt,
  totalQuestions,
  overallFeedback,
}: ResultsSummaryProps) => {
  const getPerformanceLevel = (score: number) => {
    if (score >= 8)
      return { label: "Excellent", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" }
    if (score >= 6)
      return { label: "Good", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" }
    if (score >= 4)
      return { label: "Fair", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" }
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" }
  }

  const performance = getPerformanceLevel(overallScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Interview Results</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{completedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{totalQuestions} questions</span>
                </div>
              </div>
            </div>
            <Badge className={performance.color}>{performance.label}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard
          score={overallScore}
          title="Overall Score"
          description="Combined technical and behavioral performance"
        />
        <ScoreCard score={technicalAverage} title="Technical Skills" description="Coding and technical knowledge" />
        <ScoreCard score={behavioralAverage} title="Behavioral Skills" description="Communication and soft skills" />
      </div>

      {/* Overall Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-foreground leading-relaxed">{overallFeedback}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
