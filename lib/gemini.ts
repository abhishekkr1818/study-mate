import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface SummaryOptions {
  length: "brief" | "detailed" | "comprehensive";
  focus?: string; // optional focus area
}

export interface GeminiSummaryResponse {
  title: string;
  content: string;
  wordCount: number;
  readTime: number;
}

export async function generateSummaryFromPDF(
  pdfContent: string,
  documentName: string,
  options: SummaryOptions = { length: "detailed" }
): Promise<GeminiSummaryResponse> {
  try {
    console.log("Initializing Gemini model...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini model initialized successfully");

    const lengthInstructions = {
      brief: "Create a concise summary in 2-3 paragraphs",
      detailed: "Create a comprehensive summary covering all key points",
      comprehensive: "Create an extensive summary with detailed analysis and insights"
    };

    const prompt = `
You are an expert academic assistant. Please analyze the following PDF content and create a ${options.length} summary.

Document: ${documentName}
Focus: ${options.focus || "General overview"}

Instructions:
- ${lengthInstructions[options.length]}
- Use clear, academic language
- Include key concepts, main arguments, and important details
- Structure the content with proper headings and bullet points
- Maintain accuracy and objectivity
- Highlight the most important information

PDF Content:
${pdfContent}

Please provide:
1. A descriptive title for the summary
2. Well-structured content with headings
3. Word count
4. Estimated reading time in minutes

Format your response as JSON:
{
  "title": "Summary Title",
  "content": "Formatted summary content with markdown",
  "wordCount": number,
  "readTime": number
}
`;

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini API, length:", text.length);

    // Parse JSON response
    let summaryData;
    try {
      summaryData = JSON.parse(text);
      console.log("Successfully parsed JSON response");
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response:", text);
      throw new Error("Failed to parse AI response");
    }
    
    return {
      title: summaryData.title,
      content: summaryData.content,
      wordCount: summaryData.wordCount,
      readTime: summaryData.readTime
    };

  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function generateCrossDocumentSummary(
  documents: Array<{ name: string; content: string }>,
  options: SummaryOptions = { length: "detailed" }
): Promise<GeminiSummaryResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const documentsText = documents.map((doc, index) => 
      `Document ${index + 1}: ${doc.name}\n${doc.content}\n---\n`
    ).join('\n');

    const prompt = `
You are an expert academic assistant. Please analyze the following multiple documents and create a cross-document analysis.

Documents:
${documentsText}

Instructions:
- Create a ${options.length} cross-document analysis
- Identify common themes, patterns, and relationships between documents
- Highlight key differences and similarities
- Provide insights that emerge from comparing the documents
- Use clear, academic language with proper structure
- Include headings and bullet points for clarity

Focus: ${options.focus || "Comparative analysis and insights"}

Please provide:
1. A descriptive title for the cross-document analysis
2. Well-structured content with headings
3. Word count
4. Estimated reading time in minutes

Format your response as JSON:
{
  "title": "Cross-Document Analysis Title",
  "content": "Formatted analysis content with markdown",
  "wordCount": number,
  "readTime": number
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const summaryData = JSON.parse(text);
    
    return {
      title: summaryData.title,
      content: summaryData.content,
      wordCount: summaryData.wordCount,
      readTime: summaryData.readTime
    };

  } catch (error) {
    console.error("Error generating cross-document summary with Gemini:", error);
    throw new Error("Failed to generate cross-document summary");
  }
}

import pdf from 'pdf-parse';

// Helper function to extract text from PDF using pdf-parse
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdf(pdfBuffer);
    
    // Clean and format the extracted text
    let text = data.text;
    
    // Remove excessive whitespace and normalize line breaks
    text = text.replace(/\s+/g, ' ').trim();
    
    // Remove page numbers and headers/footers (basic cleanup)
    text = text.replace(/\d+\s*$/gm, ''); // Remove page numbers at end of lines
    text = text.replace(/^\s*\d+\s*$/gm, ''); // Remove standalone page numbers
    
    // Limit text length to avoid token limits (Gemini has token limits)
    const maxLength = 50000; // Adjust based on your needs
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '... [Content truncated due to length]';
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
