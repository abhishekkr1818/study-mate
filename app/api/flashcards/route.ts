import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Flashcard from "@/models/Flashcard";
import Document from "@/models/Document";

// Generate flashcards from a document
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    const { documentId, count = 10 } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Verify document belongs to user
    const document = await Document.findOne({
      _id: documentId,
      userId: session.user.id,
      status: "completed"
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if flashcards already exist for this document
    const existingFlashcards = await Flashcard.find({
      documentId: documentId,
      userId: session.user.id,
      isActive: true
    });

    if (existingFlashcards.length > 0) {
      return NextResponse.json({
        success: true,
        flashcards: existingFlashcards,
        message: "Flashcards already exist for this document"
      });
    }

    // Generate flashcards (simulated for now - in real app, use AI/ML service)
    const generatedFlashcards = await generateFlashcardsFromDocument(document, count);

    // Save flashcards to database
    const savedFlashcards = await Flashcard.insertMany(generatedFlashcards);

    // Update document's flashcard count
    await Document.findByIdAndUpdate(documentId, {
      flashcardsCount: savedFlashcards.length
    });

    return NextResponse.json({
      success: true,
      flashcards: savedFlashcards,
      count: savedFlashcards.length
    });

  } catch (error) {
    console.error("Generate flashcards error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}

// Get flashcards for a user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");
    const deckId = searchParams.get("deckId");
    const studyMode = searchParams.get("studyMode") === "true";

    let query: any = {
      userId: session.user.id,
      isActive: true
    };

    if (documentId) {
      query.documentId = documentId;
    }

    if (deckId) {
      query.deckId = deckId;
    }

    // For study mode, prioritize cards that need review
    if (studyMode) {
      query.$or = [
        { nextReview: { $lte: new Date() } },
        { reviewCount: 0 },
        { nextReview: { $exists: false } }
      ];
    }

    const flashcards = await Flashcard.find(query)
      .sort({ nextReview: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ flashcards });

  } catch (error) {
    console.error("Get flashcards error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}

// Update flashcard (for ratings, edits)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    const { flashcardId, question, answer, difficulty, rating } = await request.json();

    if (!flashcardId) {
      return NextResponse.json({ error: "Flashcard ID required" }, { status: 400 });
    }

    // Verify flashcard belongs to user
    const flashcard = await Flashcard.findOne({
      _id: flashcardId,
      userId: session.user.id
    });

    if (!flashcard) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    // Update flashcard
    const updateData: any = {};
    
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    
    if (rating) {
      updateData.rating = rating;
      updateData.lastReviewed = new Date();
      updateData.reviewCount = flashcard.reviewCount + 1;
      
      // Calculate next review date based on rating
      updateData.nextReview = calculateNextReview(rating, flashcard.reviewCount);
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      flashcardId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      flashcard: updatedFlashcard
    });

  } catch (error) {
    console.error("Update flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard" },
      { status: 500 }
    );
  }
}

// Delete flashcard
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const flashcardId = searchParams.get("id");

    if (!flashcardId) {
      return NextResponse.json({ error: "Flashcard ID required" }, { status: 400 });
    }

    // Soft delete flashcard
    const flashcard = await Flashcard.findOneAndUpdate(
      {
        _id: flashcardId,
        userId: session.user.id
      },
      { isActive: false },
      { new: true }
    );

    if (!flashcard) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard" },
      { status: 500 }
    );
  }
}

// Helper function to generate flashcards from document (simulated)
async function generateFlashcardsFromDocument(document: any, count: number) {
  // This is a simulation - in a real app, you'd use AI/ML services
  // to extract content from the PDF and generate questions/answers
  
  const sampleQuestions = [
    {
      question: `What is the main topic discussed in ${document.name}?`,
      answer: `The main topic in ${document.name} covers fundamental concepts and principles related to the subject matter.`,
      difficulty: "easy" as const
    },
    {
      question: `How does ${document.name} explain the key concepts?`,
      answer: `${document.name} provides detailed explanations with examples and case studies to illustrate the key concepts.`,
      difficulty: "medium" as const
    },
    {
      question: `What are the practical applications mentioned in ${document.name}?`,
      answer: `The document outlines several practical applications including real-world scenarios and implementation strategies.`,
      difficulty: "hard" as const
    },
    {
      question: `What methodology is used in ${document.name}?`,
      answer: `The document employs a systematic approach with clear methodology and structured analysis.`,
      difficulty: "medium" as const
    },
    {
      question: `What are the key findings in ${document.name}?`,
      answer: `The key findings include significant insights and conclusions drawn from the research and analysis presented.`,
      difficulty: "hard" as const
    }
  ];

  const flashcards = [];
  const questionsToUse = sampleQuestions.slice(0, Math.min(count, sampleQuestions.length));

  for (let i = 0; i < questionsToUse.length; i++) {
    const q = questionsToUse[i];
    flashcards.push({
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty,
      documentId: document._id,
      userId: document.userId,
      source: document.name,
      reviewCount: 0,
      isActive: true
    });
  }

  return flashcards;
}

// Helper function to calculate next review date
function calculateNextReview(rating: string, reviewCount: number): Date {
  const now = new Date();
  let daysToAdd = 1;

  switch (rating) {
    case "again":
      daysToAdd = 1; // Review again tomorrow
      break;
    case "hard":
      daysToAdd = 2; // Review in 2 days
      break;
    case "medium":
      daysToAdd = 4; // Review in 4 days
      break;
    case "easy":
      daysToAdd = 7; // Review in a week
      break;
  }

  // Increase interval for cards that have been reviewed multiple times
  if (reviewCount > 5) {
    daysToAdd *= 2;
  }

  return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}
