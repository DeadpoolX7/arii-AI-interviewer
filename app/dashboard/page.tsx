"use client"
import { Suspense, useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { InterviewHistory } from "@/components/dashboard/interview-history"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getUserInterviews } from "@/lib/firestore"
import { useAuth } from "@/contexts/auth-context"
import type { InterviewSession } from "@/types/interview" // Make sure to import your types

function DashboardContent() {
  const { user } = useAuth()
  // Remove interview fetching logic since we want to focus on new interviews
  
  if (!user) {
    return <div>Please sign in to view your dashboard.</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to AI Interview Assistant</h1>
          <p className="text-muted-foreground">Start your interview preparation journey</p>
        </div>
        <Link href="/interview/upload">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Start New Interview
          </Button>
        </Link>
      </div>

      {/* Quick Start Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded">1</div>
                <div>
                  <h3 className="font-medium">Upload Your Resume</h3>
                  <p className="text-muted-foreground">Start by uploading your resume in PDF format</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded">2</div>
                <div>
                  <h3 className="font-medium">Select Job Role</h3>
                  <p className="text-muted-foreground">Choose the position you're interviewing for</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded">3</div>
                <div>
                  <h3 className="font-medium">Practice Interview</h3>
                  <p className="text-muted-foreground">Get AI-generated questions and feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-muted rounded animate-pulse" />
        <div className="space-y-6">
          <div className="h-48 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Suspense fallback={<DashboardLoading />}>
            <DashboardContent />
          </Suspense>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
