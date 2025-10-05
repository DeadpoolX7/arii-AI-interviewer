import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ScoreCardProps {
  score: number
  maxScore?: number
  title: string
  description?: string
  trend?: "up" | "down" | "neutral"
}

export const ScoreCard = ({ score, maxScore = 10, title, description, trend }: ScoreCardProps) => {
  const percentage = (score / maxScore) * 100

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400"
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {trend && getTrendIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">/ {maxScore}</span>
        </div>
        <Progress
          value={percentage}
          className="h-2 mb-2"
          style={{
            background: `linear-gradient(to right, ${getProgressColor(score)} ${percentage}%, var(--muted) ${percentage}%)`,
          }}
        />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
