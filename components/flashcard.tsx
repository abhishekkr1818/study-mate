"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  question: string
  answer: string
  difficulty: "easy" | "medium" | "hard"
  source: string
  onRate: (rating: "easy" | "medium" | "hard" | "again") => void
}

export function Flashcard({ question, answer, difficulty, source, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(!showAnswer)
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-accent/20 text-accent-foreground"
      case "medium":
        return "bg-primary/20 text-primary-foreground"
      case "hard":
        return "bg-destructive/20 text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-border/50 bg-card/50 min-h-[400px] relative overflow-hidden">
        <CardContent className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
            <Badge variant="outline" className="bg-transparent">
              {source}
            </Badge>
          </div>

          {/* Card Content */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className={cn(
                "w-full transition-all duration-500 transform-gpu",
                isFlipped ? "rotate-y-180" : "rotate-y-0",
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front (Question) */}
              <div
                className={cn(
                  "absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center space-y-4",
                  isFlipped && "rotate-y-180",
                )}
              >
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Question</h3>
                <p className="text-xl leading-relaxed text-balance">{question}</p>
              </div>

              {/* Back (Answer) */}
              <div
                className={cn(
                  "absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center space-y-4",
                  isFlipped && "rotate-y-0",
                )}
              >
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Answer</h3>
                <p className="text-xl leading-relaxed text-balance">{answer}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-6">
            <Button onClick={handleFlip} variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              {isFlipped ? "Show Question" : "Show Answer"}
            </Button>

            {/* Rating Buttons (only show when answer is visible) */}
            {isFlipped && (
              <div className="grid grid-cols-4 gap-2">
                <Button onClick={() => onRate("again")} variant="outline" size="sm" className="bg-destructive/10">
                  Again
                </Button>
                <Button onClick={() => onRate("hard")} variant="outline" size="sm" className="bg-destructive/20">
                  Hard
                </Button>
                <Button onClick={() => onRate("medium")} variant="outline" size="sm" className="bg-primary/20">
                  Good
                </Button>
                <Button onClick={() => onRate("easy")} variant="outline" size="sm" className="bg-accent/20">
                  Easy
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
