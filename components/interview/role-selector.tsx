"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Software Architect",
]

interface RoleSelectorProps {
  onSubmit: (role: string, technicalCount: number, behavioralCount: number) => void
  loading?: boolean
}

export const RoleSelector = ({ onSubmit, loading = false }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState("")
  const [technicalCount, setTechnicalCount] = useState([3])
  const [behavioralCount, setBehavioralCount] = useState([2])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole) {
      onSubmit(selectedRole, technicalCount[0], behavioralCount[0])
    }
  }

  const totalQuestions = technicalCount[0] + behavioralCount[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Configuration</CardTitle>
        <CardDescription>
          Select your target role and customize the number of questions for your mock interview.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role">Target Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Technical Questions: {technicalCount[0]}</Label>
              <Slider
                value={technicalCount}
                onValueChange={setTechnicalCount}
                max={8}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Questions about coding, system design, and technical concepts
              </p>
            </div>

            <div className="space-y-3">
              <Label>Behavioral Questions: {behavioralCount[0]}</Label>
              <Slider
                value={behavioralCount}
                onValueChange={setBehavioralCount}
                max={6}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Questions about teamwork, leadership, and past experiences
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Questions:</span>
              <span className="text-lg font-bold text-primary">{totalQuestions}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Estimated interview time: {Math.ceil(totalQuestions * 3)} - {Math.ceil(totalQuestions * 5)} minutes
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={!selectedRole || loading} size="lg">
            {loading ? "Generating Questions..." : "Generate Interview Questions"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
