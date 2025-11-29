"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
// import { Google } from "lucide-react"; // <-- add this import

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
    } else if (user) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { user, error: authError } = await signInWithGoogle();

    if (authError) {
      setError(authError);
    } else if (user) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-center">OR</p>
          <Button
            type="button"
            className="w-full mt-2"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9.1 3.3l6.8-6.8C35.5 2.3 30.3 0 24 0 14.5 0 6.4 5.4 2.1 13.3l7.9 6.1C12.4 13.8 17.5 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24c0-1.6-.1-3.2-.4-4.8H24v9.1h12.9c-.6 3.4-2.6 6.3-5.5 8.3l7.9 6.1c4.6-4.3 7.5-10.5 7.5-17.7z"
              />
              <path
                fill="#FBBC05"
                d="M9.1 28.4c-.8-2.4-1.2-5-1.2-7.4s.4-5 1.2-7.4l-7.9-6.1C2.4 12.5 0 18.1 0 24s2.4 11.5 5.2 16.5l7.9-6.1z"
              />
              <path
                fill="#4285F4"
                d="M24 48c6.3 0 11.5-2.1 15.4-5.7l-7.9-6.1c-2.2 1.5-5 2.4-7.5 2.4-6.5 0-11.6-4.3-13.5-10.2l-7.9 6.1C6.4 42.6 14.5 48 24 48z"
              />
            </svg>
            Sign In with Google
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
