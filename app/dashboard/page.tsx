import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, FileText, Zap, Upload, TrendingUp, Clock, Target } from "lucide-react"
import { cookies } from "next/headers"

type Doc = { _id: string; name: string; status: string; uploadDate?: string; fileSize?: number }
type Summary = { _id: string; readTime: number; generatedAt: string }
type Flashcard = { _id: string; createdAt?: string; documentId: string }

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const cookieHeader = cookies().toString()
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      }
    })
    const ct = res.headers.get("content-type") || ""
    if (ct.includes("application/json")) {
      const data = await res.json()
      return data as T
    }
    return null
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const [docsData, sumsData, cardsData] = await Promise.all([
    fetchJSON<{ documents: Doc[] }>("/api/documents"),
    fetchJSON<{ summaries: Summary[] }>("/api/summaries"),
    fetchJSON<{ flashcards: Flashcard[] }>("/api/flashcards"),
  ])

  const documents = docsData?.documents || []
  const summaries = sumsData?.summaries || []
  const flashcards = cardsData?.flashcards || []

  const documentsCount = documents.length
  const summariesCount = summaries.length
  const flashcardsCount = flashcards.length
  const timeSavedMinutes = summaries.reduce((acc, s) => acc + (Number(s.readTime) || 0), 0)

  // Build recent activity: latest 5 items from documents (by uploadDate) and summaries/flashcards (by generatedAt/createdAt)
  const recentDocs = [...documents]
    .filter(d => !!d.uploadDate)
    .sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime())
    .slice(0, 5)
  const recentSums = [...summaries]
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, 5)
  const recentCards = [...flashcards]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)

  const activity = [
    ...recentDocs.map(d => ({
      type: "document" as const,
      title: `Uploaded ${d.name}`,
      when: d.uploadDate ? new Date(d.uploadDate).toLocaleString() : "",
      color: "bg-primary",
    })),
    ...recentSums.map(s => ({
      type: "summary" as const,
      title: `Generated a summary (${s.readTime} min read)`,
      when: new Date(s.generatedAt).toLocaleString(),
      color: "bg-accent",
    })),
    ...recentCards.map(() => ({
      type: "flashcard" as const,
      title: `Added flashcards`,
      when: "",
      color: "bg-muted-foreground",
    })),
  ]
    .slice(0, 7)

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Dashboard Overview</h1>
        <p className="text-muted-foreground text-pretty">Your learning stats are up to date from the database.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsCount}</div>
            <p className="text-xs text-muted-foreground">Total uploaded</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Summaries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summariesCount}</div>
            <p className="text-xs text-muted-foreground">AI-generated</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flashcardsCount}</div>
            <p className="text-xs text-muted-foreground">Total cards</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSavedMinutes}m</div>
            <p className="text-xs text-muted-foreground">Estimated from summaries</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with your learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2" size="sm" asChild>
              <a href="/dashboard/documents"><Upload className="h-4 w-4" /> Upload New Document</a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm" asChild>
              <a href="/dashboard/chat">Chat with AI</a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm" asChild>
              <a href="/dashboard/flashcards"><Zap className="h-4 w-4" /> Generate Flashcards</a>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest uploads and AI outputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity yet. Try uploading a document.</p>
            ) : (
              activity.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-2 w-2 ${item.color} rounded-full`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.when && <p className="text-xs text-muted-foreground">{item.when}</p>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Learning Progress (placeholder computed from counts) */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Progress
            </CardTitle>
            <CardDescription>Snapshot based on your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processed Documents</span>
                <span>{documents.filter(d => d.status === "completed").length}/{documentsCount}</span>
              </div>
              <Progress value={documentsCount ? (documents.filter(d => d.status === "completed").length / documentsCount) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Summaries Generated</span>
                <span>{summariesCount}</span>
              </div>
              <Progress value={Math.min(summariesCount * 10, 100)} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Flashcards Created</span>
                <span>{flashcardsCount}</span>
              </div>
              <Progress value={Math.min(flashcardsCount * 5, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
