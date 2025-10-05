"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import { uploadResumeFile } from "@/lib/storage"
import { extractTextFromPDF, extractTextFallback } from "@/lib/pdf-extractor"
import { useAuth } from "@/contexts/auth-context"

interface ResumeUploadProps {
  onUploadComplete: (resumeText: string, fileName: string, downloadURL: string) => void
}

export const ResumeUpload = ({ onUploadComplete }: ResumeUploadProps) => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file || !user) return

      setError("")
      setUploadedFile(file)
      setUploading(true)
      setProgress(10)

      try {
        // Extract text from PDF first
        setExtracting(true)
        setProgress(30)

        const { text: resumeText, error: extractError } = await extractTextFromPDF(file)
        setProgress(60)

        let finalText = resumeText
        if (extractError || !resumeText.trim()) {
          console.warn("PDF extraction failed, using fallback:", extractError)
          finalText = extractTextFallback(file.name)
        }

        // Upload file to Firebase Storage
        setProgress(80)
        const { downloadURL, fileName, error: uploadError } = await uploadResumeFile(file, user.uid)

        if (uploadError || !downloadURL || !fileName) {
          throw new Error(uploadError || "Upload failed")
        }

        setProgress(100)
        setIsComplete(true)

        // Call the completion callback
        onUploadComplete(finalText, fileName, downloadURL)
      } catch (err: any) {
        setError(err.message || "Failed to process resume")
      } finally {
        setUploading(false)
        setExtracting(false)
      }
    },
    [user, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || isComplete,
  })

  const resetUpload = () => {
    setUploadedFile(null)
    setIsComplete(false)
    setProgress(0)
    setError("")
  }

  if (isComplete && uploadedFile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Resume Uploaded Successfully
          </CardTitle>
          <CardDescription>Your resume has been processed and is ready for interview generation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetUpload}>
              <X className="h-4 w-4 mr-2" />
              Change File
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload a PDF version of your resume to generate personalized interview questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${uploading ? "cursor-not-allowed opacity-50" : "hover:border-primary hover:bg-primary/5"}
          `}
        >
          <input {...getInputProps()} />

          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

          {uploading ? (
            <div className="space-y-4">
              <p className="text-lg font-medium">
                {extracting ? "Extracting text from PDF..." : "Uploading resume..."}
              </p>
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume here"}
              </p>
              <p className="text-muted-foreground mb-4">or click to browse files</p>
              <Button variant="outline">Choose File</Button>
              <p className="text-xs text-muted-foreground mt-4">Supports PDF files up to 10MB</p>
            </div>
          )}
        </div>

        {uploadedFile && !isComplete && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
