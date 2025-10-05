import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Master Your Next Interview with <span className="text-primary">AI-Powered Practice</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Upload your resume, select your target role, and practice with personalized technical and behavioral
            questions. Get instant feedback to improve your interview performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Interview
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Questions</h3>
              <p className="text-muted-foreground">
                Get personalized interview questions based on your resume and target role using advanced AI.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Role-Specific Practice</h3>
              <p className="text-muted-foreground">
                Practice with questions tailored to your specific role, from frontend to backend to full-stack.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-muted-foreground">
                Receive detailed feedback and scores on your answers to continuously improve your performance.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Upload Resume</h4>
              <p className="text-muted-foreground text-sm">Upload your PDF resume for analysis</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Select Role</h4>
              <p className="text-muted-foreground text-sm">Choose your target position</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Practice Interview</h4>
              <p className="text-muted-foreground text-sm">Answer AI-generated questions</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Get Feedback</h4>
              <p className="text-muted-foreground text-sm">Receive detailed performance analysis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
