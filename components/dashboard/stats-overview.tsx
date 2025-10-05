import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Clock, Award } from "lucide-react"

interface StatsOverviewProps {
  totalInterviews: number
  averageScore: number
  totalTimeSpent: number // in minutes
  bestScore: number
}

export const StatsOverview = ({ totalInterviews, averageScore, totalTimeSpent, bestScore }: StatsOverviewProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const stats = [
    {
      title: "Total Interviews",
      value: totalInterviews.toString(),
      icon: Target,
      description: "Completed sessions",
    },
    {
      title: "Average Score",
      value: averageScore.toFixed(1),
      icon: TrendingUp,
      description: "Out of 10.0",
    },
    {
      title: "Time Practiced",
      value: formatTime(totalTimeSpent),
      icon: Clock,
      description: "Total practice time",
    },
    {
      title: "Best Score",
      value: bestScore.toFixed(1),
      icon: Award,
      description: "Personal best",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
