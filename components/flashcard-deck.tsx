"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flashcard } from "@/components/flashcard"
import { Play, Pause, RotateCcw, Download, Settings, Trophy, Target, Clock, TrendingUp, BarChart3, Zap } from "lucide-react"

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
    startTime: null as Date | null,
    sessionTime: 0,
  })
  const [sessionComplete, setSessionComplete] = useState(false)
  const [studyMode, setStudyMode] = useState<'all' | 'new' | 'review'>('all')

  // Filter cards based on study mode
  const filteredCards = cards.filter(card => {
    if (studyMode === 'new') return card.reviewCount === 0
    if (studyMode === 'review') return card.reviewCount > 0
    return true
  })

  const currentCard = filteredCards[currentCardIndex]
  const progress = filteredCards.length > 0 ? ((currentCardIndex + 1) / filteredCards.length) * 100 : 0

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStudying && studyStats.startTime) {
      interval = setInterval(() => {
        setStudyStats(prev => ({
          ...prev,
          sessionTime: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000)
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStudying, studyStats.startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // Study session complete
      setSessionComplete(true)
      setIsStudying(false)
    }
  }

  const startStudySession = () => {
    setIsStudying(true)
    setCurrentCardIndex(0)
    setSessionComplete(false)
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      total: 0, 
      startTime: new Date(),
      sessionTime: 0
    })
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setSessionComplete(false)
    setStudyStats({ 
      correct: 0, 
      incorrect: 0, 
      total: 0, 
      startTime: new Date(),
      sessionTime: 0
    })
  }

  const endSession = () => {
    setIsStudying(false)
    setSessionComplete(true)
  }

  const accuracy = studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0

  if (!isStudying && !sessionComplete) {
    return (
      <div className="space-y-6">
        {/* Deck Overview */}
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {title}
                </CardTitle>
                <p className="text-muted-foreground text-pretty">{description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="bg-transparent px-3 py-1">
                  {totalCards} cards
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Ready to study</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Study Mode Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Study Mode</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={studyMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStudyMode('all')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-xs">All Cards</span>
                  <span className="text-xs text-muted-foreground">{cards.length}</span>
                </Button>
                <Button
                  variant={studyMode === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStudyMode('new')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xs">New Cards</span>
                  <span className="text-xs text-muted-foreground">{cards.filter(c => c.reviewCount === 0).length}</span>
                </Button>
                <Button
                  variant={studyMode === 'review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStudyMode('review')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-xs">Review</span>
                  <span className="text-xs text-muted-foreground">{cards.filter(c => c.reviewCount > 0).length}</span>
                </Button>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Difficulty Breakdown</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {cards.filter((c) => c.difficulty === "easy").length}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">Easy</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {cards.filter((c) => c.difficulty === "medium").length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Medium</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {cards.filter((c) => c.difficulty === "hard").length}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">Hard</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={startStudySession} 
                className="flex-1 gap-2 h-12 text-lg font-medium"
                disabled={filteredCards.length === 0}
              >
                <Play className="h-5 w-5" />
                Start Study Session
                {filteredCards.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredCards.length}
                  </Badge>
                )}
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

            {filteredCards.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>No cards available for the selected study mode.</p>
              </div>
            )}
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

  // Session completion screen
  if (sessionComplete) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Session Complete!
            </h2>
            <p className="text-muted-foreground mb-6">Great job on completing your study session</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{studyStats.correct}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{studyStats.incorrect}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatTime(studyStats.sessionTime)}</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={startStudySession} className="gap-2">
                <Play className="h-4 w-4" />
                Study Again
              </Button>
              <Button variant="outline" onClick={() => setSessionComplete(false)} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                View Deck
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Study Progress */}
      <Card className="border-border/50 bg-gradient-to-r from-card/50 to-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{currentCardIndex + 1}</p>
                <p className="text-xs text-muted-foreground">of {filteredCards.length}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">{formatTime(studyStats.sessionTime)}</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={resetSession} title="Restart Session">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={endSession} title="End Session">
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{studyStats.correct}</p>
              <p className="text-xs text-green-700 dark:text-green-300">Correct</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{studyStats.incorrect}</p>
              <p className="text-xs text-red-700 dark:text-red-300">Incorrect</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{accuracy}%</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Accuracy</p>
            </div>
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
