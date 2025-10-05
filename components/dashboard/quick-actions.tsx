import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Play, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export const QuickActions = () => {
  const actions = [
    {
      title: "Start New Interview",
      description: "Upload your resume and begin a new mock interview",
      icon: Upload,
      href: "/interview/upload",
      variant: "default" as const,
    },
    {
      title: "Practice Mode",
      description: "Quick practice with random questions",
      icon: Play,
      href: "/practice",
      variant: "outline" as const,
    },
    {
      title: "View Analytics",
      description: "Detailed performance insights and trends",
      icon: BarChart3,
      href: "/analytics",
      variant: "outline" as const,
    },
    {
      title: "Settings",
      description: "Customize your interview preferences",
      icon: Settings,
      href: "/settings",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href} className="block">
                <Button 
                  variant={action.variant} 
                  className="w-full min-h-[5rem] p-4 flex flex-col items-start gap-2 text-left relative group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium truncate">{action.title}</span>
                  </div>
                  <span className="text-xs text-left opacity-80 line-clamp-2 w-full max-w-[200px] group-hover:line-clamp-none group-hover:absolute group-hover:top-full group-hover:bg-popover group-hover:p-2 group-hover:rounded-md group-hover:shadow-md group-hover:z-10">
                    {action.description}
                  </span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
