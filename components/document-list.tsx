"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Search, MoreVertical, Download, Trash2, MessageSquare, Zap } from "lucide-react"

interface Document {
  id: string
  name: string
  size: string
  uploadDate: string
  status: "processed" | "processing" | "error"
  tags: string[]
  questionsCount: number
  flashcardsCount: number
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Machine Learning Fundamentals.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "processed",
    tags: ["AI", "Computer Science"],
    questionsCount: 23,
    flashcardsCount: 45,
  },
  {
    id: "2",
    name: "Statistics for Data Science.pdf",
    size: "1.8 MB",
    uploadDate: "2024-01-14",
    status: "processed",
    tags: ["Statistics", "Data Science"],
    questionsCount: 18,
    flashcardsCount: 32,
  },
  {
    id: "3",
    name: "Research Methods in Psychology.pdf",
    size: "3.1 MB",
    uploadDate: "2024-01-13",
    status: "processing",
    tags: ["Psychology", "Research"],
    questionsCount: 0,
    flashcardsCount: 0,
  },
  {
    id: "4",
    name: "Linear Algebra Textbook.pdf",
    size: "4.2 MB",
    uploadDate: "2024-01-12",
    status: "processed",
    tags: ["Mathematics", "Linear Algebra"],
    questionsCount: 31,
    flashcardsCount: 67,
  },
]

export function DocumentList() {
  const [documents] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "processed":
        return "bg-accent/20 text-accent-foreground"
      case "processing":
        return "bg-primary/20 text-primary-foreground"
      case "error":
        return "bg-destructive/20 text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <FileText className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 truncate">{document.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{document.size}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-transparent">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {document.status === "processed" && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {document.questionsCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          {document.flashcardsCount} flashcards
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ask Questions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Flashcards
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
