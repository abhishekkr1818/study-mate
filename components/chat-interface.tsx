"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, FileText, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  citations?: Citation[]
}

interface Citation {
  documentName: string
  pageNumber: number
  snippet: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content:
      "Hello! I'm your AI study assistant. I can help you understand your documents, answer questions, and generate study materials. What would you like to learn about today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    type: "user",
    content: "What are the main types of machine learning algorithms?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "3",
    type: "assistant",
    content:
      "Based on your uploaded documents, there are three main types of machine learning algorithms:\n\n1. **Supervised Learning**: Uses labeled training data to learn a mapping from inputs to outputs. Examples include linear regression, decision trees, and neural networks.\n\n2. **Unsupervised Learning**: Finds patterns in data without labeled examples. Common techniques include clustering (k-means), dimensionality reduction (PCA), and association rules.\n\n3. **Reinforcement Learning**: Learns through interaction with an environment, receiving rewards or penalties for actions. Used in game playing, robotics, and autonomous systems.\n\nEach type has different use cases and is suited for different kinds of problems.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
    citations: [
      {
        documentName: "Machine Learning Fundamentals.pdf",
        pageNumber: 23,
        snippet:
          "Supervised learning algorithms learn from labeled training data to make predictions on new, unseen data...",
      },
      {
        documentName: "Machine Learning Fundamentals.pdf",
        pageNumber: 45,
        snippet:
          "Unsupervised learning techniques discover hidden patterns in data without the need for labeled examples...",
      },
    ],
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm processing your question and searching through your documents to provide the most accurate answer. This is a simulated response for the demo.",
        timestamp: new Date(),
        citations: [
          {
            documentName: "Statistics for Data Science.pdf",
            pageNumber: 12,
            snippet: "This is a sample citation snippet that would be extracted from your document...",
          },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-4", message.type === "user" ? "justify-end" : "justify-start")}
            >
              {message.type === "assistant" && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={cn("max-w-[80%] space-y-2", message.type === "user" ? "items-end" : "items-start")}>
                <Card
                  className={cn(
                    "border-border/50",
                    message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-card/50",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {message.content.split("\n").map((line, index) => (
                        <p key={index} className="mb-2 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Sources:</p>
                    {message.citations.map((citation, index) => (
                      <Card key={index} className="border-border/30 bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium truncate">{citation.documentName}</span>
                                <Badge variant="outline" className="text-xs">
                                  Page {citation.pageNumber}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{citation.snippet}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Message Actions */}
                {message.type === "assistant" && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-muted-foreground ml-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>

              {message.type === "user" && (
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-background/50"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            StudyMate can make mistakes. Verify important information with your source documents.
          </p>
        </div>
      </div>
    </div>
  )
}
