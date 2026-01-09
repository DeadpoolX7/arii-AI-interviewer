"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResumeUpload } from "@/components/upload/resume-upload"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function UploadPage() {
  const [resumeData, setResumeData] = useState<{
    text: string
    fileName: string
    downloadURL: string
  } | null>(null)
  const router = useRouter()

  const handleUploadComplete = (resumeText: string, fileName: string, downloadURL: string) => {
    setResumeData({ text: resumeText, fileName, downloadURL })
  }

  const handleContinue = () => {
    if (resumeData) {
      // Store resume data in sessionStorage for the next step
      sessionStorage.setItem("resumeData", JSON.stringify(resumeData))
      router.push("/interview/generate")
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Resume</h1>
            <p className="text-muted-foreground">
              Start by uploading your resume to generate personalized interview questions.
            </p>
          </div>

          <div className="space-y-6">
            {typeof window !== 'undefined' && <ResumeUpload onUploadComplete={handleUploadComplete} />}

            {resumeData && (
              <div className="flex justify-end">
                <Button onClick={handleContinue} size="lg">
                  Continue to Interview Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Your resume text will be extracted and analyzed</li>
              <li>You'll select your target role and interview preferences</li>
              <li>AI will generate personalized questions based on your background</li>
              <li>You'll answer questions and receive detailed feedback</li>
            </ol>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
