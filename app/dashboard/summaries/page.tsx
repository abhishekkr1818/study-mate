import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, Search, Download, RefreshCw, Clock, BookOpen, Zap } from "lucide-react"

const mockSummaries = [
  {
    id: "1",
    title: "Machine Learning Fundamentals - Chapter 1-3",
    document: "Machine Learning Fundamentals.pdf",
    type: "document",
    length: "detailed",
    generatedAt: "2024-01-15T10:30:00Z",
    content: `# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Key Concepts:
- **Supervised Learning**: Uses labeled training data to learn patterns
- **Unsupervised Learning**: Discovers hidden patterns in unlabeled data  
- **Reinforcement Learning**: Learns through trial and error with rewards

## Applications:
Machine learning is widely used in recommendation systems, image recognition, natural language processing, and autonomous vehicles.`,
    wordCount: 156,
    readTime: "2 min",
  },
  {
    id: "2",
    title: "Statistical Methods Overview",
    document: "Statistics for Data Science.pdf",
    type: "document",
    length: "brief",
    generatedAt: "2024-01-14T14:20:00Z",
    content: `# Statistical Methods Summary

## Hypothesis Testing
- Null hypothesis (H₀) vs Alternative hypothesis (H₁)
- P-values and significance levels
- Type I and Type II errors

## Key Statistical Tests
- T-tests for comparing means
- Chi-square tests for categorical data
- ANOVA for multiple group comparisons

## Confidence Intervals
Provide range of plausible values for population parameters with specified confidence level.`,
    wordCount: 89,
    readTime: "1 min",
  },
  {
    id: "3",
    title: "Cross-Document Analysis: ML & Statistics",
    document: "Multiple Documents",
    type: "cross-document",
    length: "detailed",
    generatedAt: "2024-01-13T16:45:00Z",
    content: `# Machine Learning and Statistics Integration

## Common Ground
Both machine learning and statistics deal with data analysis and pattern recognition, but approach problems differently.

## Key Differences:
- **Statistics**: Focus on inference and understanding relationships
- **Machine Learning**: Emphasis on prediction and automation

## Complementary Approaches:
Statistical methods provide theoretical foundation for many ML algorithms, while ML offers scalable solutions for complex data problems.`,
    wordCount: 124,
    readTime: "2 min",
  },
]

export default function SummariesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">AI Summaries</h1>
        <p className="text-muted-foreground text-pretty">
          AI-generated summaries of your documents and cross-document insights
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Summaries</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="cross-document">Cross-Document</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search summaries..." className="pl-10 w-64 bg-background/50" />
            </div>
            <Button className="gap-2">
              <Zap className="h-4 w-4" />
              Generate New
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Total Summaries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-xs text-muted-foreground">Cross-Document</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">45m</p>
                    <p className="text-xs text-muted-foreground">Time Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summaries List */}
          <div className="grid gap-6">
            {mockSummaries.map((summary) => (
              <Card key={summary.id} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{summary.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {summary.document}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {summary.readTime} read
                        </span>
                        <span>{summary.wordCount} words</span>
                        <span>Generated {new Date(summary.generatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          summary.type === "cross-document"
                            ? "bg-primary/20 text-primary-foreground"
                            : "bg-accent/20 text-accent-foreground"
                        }
                      >
                        {summary.type === "cross-document" ? "Cross-Document" : "Document"}
                      </Badge>
                      <Badge variant="outline" className="bg-transparent">
                        {summary.length}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {summary.content.substring(0, 300)}...
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Read Full Summary
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="document">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Document Summaries</h3>
            <p className="text-muted-foreground">View summaries filtered by individual documents</p>
          </div>
        </TabsContent>

        <TabsContent value="cross-document">
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cross-Document Analysis</h3>
            <p className="text-muted-foreground">AI-generated insights across multiple documents</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
