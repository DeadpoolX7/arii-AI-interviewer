import { SignInForm } from "@/components/auth/signin-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">AI Resume Interviewer</h1>
          <p className="text-muted-foreground mt-2">Welcome back</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
