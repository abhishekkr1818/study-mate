"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flashcard } from "@/components/flashcard"
import { Play, Pause, RotateCcw, Download, Settings } from "lucide-react"

interface FlashcardData {
  _id: string
  question: string
  answer: string
  difficulty: "easy" | "medium" | "hard"
  source: string
  lastReviewed?: Date
  nextReview?: Date
  reviewCount: number
  rating?: "again" | "hard" | "medium" | "easy"
}

interface FlashcardDeckProps {
  title: string
  description: string
  cards: FlashcardData[]
  totalCards: number
}

export function FlashcardDeck({ title, description, cards, totalCards }: FlashcardDeckProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isStudying, setIsStudying] = useState(false)
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  })

  const currentCard = cards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / cards.length) * 100

  const handleCardRating = async (rating: "easy" | "medium" | "hard" | "again") => {
    setStudyStats((prev) => ({
      ...prev,
      correct: rating === "easy" || rating === "medium" ? prev.correct + 1 : prev.correct,
      incorrect: rating === "again" || rating === "hard" ? prev.incorrect + 1 : prev.incorrect,
      total: prev.total + 1,
    }))

    // Update flashcard rating in database
    if (currentCard) {
      try {
        await fetch("/api/flashcards", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flashcardId: currentCard._id,
            rating: rating,
          }),
        })
      } catch (error) {
        console.error("Error updating flashcard rating:", error)
      }
    }

    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // Study session complete
      setIsStudying(false)
      setCurrentCardIndex(0)
    }
  }

  const startStudySession = () => {
    setIsStudying(true)
    setCurrentCardIndex(0)
    setStudyStats({ correct: 0, incorrect: 0, total: 0 })
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setStudyStats({ correct: 0, incorrect: 0, total: 0 })
  }

  if (!isStudying) {
    return (
      <div className="space-y-6">
        {/* Deck Overview */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{title}</CardTitle>
                <p className="text-muted-foreground text-pretty">{description}</p>
              </div>
              <Badge variant="outline" className="bg-transparent">
                {totalCards} cards
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">{cards.filter((c) => c.difficulty === "easy").length}</p>
                <p className="text-sm text-muted-foreground">Easy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {cards.filter((c) => c.difficulty === "medium").length}
                </p>
                <p className="text-sm text-muted-foreground">Medium</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {cards.filter((c) => c.difficulty === "hard").length}
                </p>
                <p className="text-sm text-muted-foreground">Hard</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={startStudySession} className="flex-1 gap-2">
                <Play className="h-4 w-4" />
                Start Study Session
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Accuracy</span>
                <span className="font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cards Mastered:</span>
                  <span>23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study Streak:</span>
                  <span>5 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Study Progress */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetSession}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsStudying(false)}>
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Correct: {studyStats.correct}</span>
            <span>Incorrect: {studyStats.incorrect}</span>
          </div>
        </CardContent>
      </Card>

      {/* Current Flashcard */}
      {currentCard && (
        <Flashcard
          question={currentCard.question}
          answer={currentCard.answer}
          difficulty={currentCard.difficulty}
          source={currentCard.source}
          onRate={handleCardRating}
        />
      )}
    </div>
  )
}
