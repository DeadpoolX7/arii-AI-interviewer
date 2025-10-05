"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface QuestionResultProps {
  question: string
  answer: string
  feedback: string
  score: number
  type: "technical" | "behavioral"
  suggestions?: string
  questionNumber: number
}

export const QuestionResult = ({
  question,
  answer,
  feedback,
  score,
  type,
  suggestions,
  questionNumber,
}: QuestionResultProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <CardTitle className="text-base">Question {questionNumber}</CardTitle>
                <Badge variant={type === "technical" ? "default" : "secondary"}>{type}</Badge>
              </div>
              <Badge className={getScoreColor(score)}>{score}/10</Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Question</h4>
                <p className="text-foreground leading-relaxed">{question}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Your Answer</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Feedback</h4>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-900 dark:text-blue-100 leading-relaxed">{feedback}</p>
                </div>
              </div>

              {suggestions && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Suggestions for Improvement</h4>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-900 dark:text-green-100 leading-relaxed">{suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
