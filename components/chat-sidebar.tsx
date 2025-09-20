"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, Clock, FileText } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  documents: string[]
}

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Machine Learning Basics",
    lastMessage: "What are the main types of ML algorithms?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    messageCount: 8,
    documents: ["Machine Learning Fundamentals.pdf"],
  },
  {
    id: "2",
    title: "Statistics Questions",
    lastMessage: "Explain hypothesis testing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 12,
    documents: ["Statistics for Data Science.pdf"],
  },
  {
    id: "3",
    title: "Research Methods",
    lastMessage: "What is qualitative vs quantitative research?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messageCount: 6,
    documents: ["Research Methods in Psychology.pdf"],
  },
]

export function ChatSidebar() {
  const [sessions] = useState<ChatSession[]>(mockSessions)
  const [activeSession, setActiveSession] = useState<string>("1")

  return (
    <div className="w-80 border-r border-border/50 bg-card/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Chat Sessions</h2>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-colors border-border/30 ${
                activeSession === session.id ? "bg-primary/10 border-primary/30" : "bg-card/50 hover:bg-card/80"
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm line-clamp-1">{session.title}</h3>
                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                      {session.messageCount}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{session.lastMessage}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{session.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {session.documents.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc.split(".")[0].substring(0, 15)}...
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border/50">
        <Card className="border-border/30 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
              Ask about all documents
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
              Compare documents
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
              Generate summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
