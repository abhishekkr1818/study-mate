import { FlashcardDeck } from "@/components/flashcard-deck"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Plus, BookOpen, TrendingUp, Clock } from "lucide-react"

const mockFlashcards = [
  {
    id: "1",
    question: "What are the three main types of machine learning?",
    answer:
      "The three main types are: 1) Supervised Learning - uses labeled data, 2) Unsupervised Learning - finds patterns in unlabeled data, 3) Reinforcement Learning - learns through rewards and penalties.",
    difficulty: "medium" as const,
    source: "ML Fundamentals.pdf",
    reviewCount: 3,
  },
  {
    id: "2",
    question: "Define overfitting in machine learning.",
    answer:
      "Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, resulting in poor performance on new, unseen data.",
    difficulty: "hard" as const,
    source: "ML Fundamentals.pdf",
    reviewCount: 1,
  },
  {
    id: "3",
    question: "What is the purpose of cross-validation?",
    answer:
      "Cross-validation is used to assess how well a model will generalize to new data by splitting the dataset into multiple folds and training/testing on different combinations.",
    difficulty: "easy" as const,
    source: "ML Fundamentals.pdf",
    reviewCount: 5,
  },
]

const mockDecks = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Core concepts and algorithms in machine learning",
    cardCount: 45,
    newCards: 12,
    reviewCards: 8,
    source: "ML Fundamentals.pdf",
    lastStudied: "2024-01-15",
  },
  {
    id: "2",
    title: "Statistics for Data Science",
    description: "Statistical methods and hypothesis testing",
    cardCount: 32,
    newCards: 5,
    reviewCards: 15,
    source: "Statistics.pdf",
    lastStudied: "2024-01-14",
  },
  {
    id: "3",
    title: "Research Methods",
    description: "Qualitative and quantitative research approaches",
    cardCount: 28,
    newCards: 8,
    reviewCards: 3,
    source: "Research Methods.pdf",
    lastStudied: "2024-01-13",
  },
]

export default function FlashcardsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Flashcards</h1>
        <p className="text-muted-foreground text-pretty">
          Study with AI-generated flashcards and track your learning progress
        </p>
      </div>

      <Tabs defaultValue="decks" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="decks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Decks
          </TabsTrigger>
          <TabsTrigger value="study" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Study Session
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decks" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">Total Decks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">105</p>
                    <p className="text-xs text-muted-foreground">Total Cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deck List */}
          <div className="grid gap-4">
            {mockDecks.map((deck) => (
              <Card key={deck.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{deck.title}</h3>
                        <Badge variant="outline" className="bg-transparent">
                          {deck.cardCount} cards
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{deck.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          {deck.newCards} new
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-accent rounded-full" />
                          {deck.reviewCards} review
                        </span>
                        <span className="text-muted-foreground">
                          Last studied: {new Date(deck.lastStudied).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Study Now</Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create New Deck */}
          <Card className="border-border/50 bg-card/50 border-dashed">
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create New Deck</h3>
              <p className="text-muted-foreground mb-4">Generate flashcards from your uploaded documents</p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Deck
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study" className="space-y-6">
          <FlashcardDeck
            title="Machine Learning Fundamentals"
            description="Core concepts and algorithms in machine learning"
            cards={mockFlashcards}
            totalCards={45}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
