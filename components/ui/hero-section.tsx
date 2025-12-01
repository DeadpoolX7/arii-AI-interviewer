import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Prismatic Aurora Burst – Multi‑layered Gradient */}
      <div
        className="absolute inset-0 z-0 hero-bg"
        
      />

      {/* Content */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ace Your Next Interview with <span className="text-primary">AI‑Powered Coaching</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Upload your resume, get personalized questions, and receive instant feedback.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                Start Free Interview
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 text-primary border-primary hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI‑Powered Questions</h3>
                <p className="text-muted-foreground">
                  Get personalized interview questions based on your resume and target role using advanced AI.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Role‑Specific Practice</h3>
                <p className="text-muted-foreground">
                  Practice with questions tailored to your specific role, from frontend to backend to full‑stack.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
                <p className="text-muted-foreground">
                  Receive detailed feedback and scores on your answers to continuously improve your performance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              {[
                { step: 1, title: "Upload Resume", desc: "Upload your PDF resume for analysis" },
                { step: 2, title: "Select Role", desc: "Choose your target position" },
                { step: 3, title: "Practice Interview", desc: "Answer AI‑generated questions" },
                { step: 4, title: "Get Feedback", desc: "Receive detailed performance analysis" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    {step}
                  </div>
                  <h4 className="font-semibold mb-2">{title}</h4>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
