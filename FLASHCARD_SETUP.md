# Flashcard Backend Setup Guide

## Issues Fixed

The flashcards backend has been fixed with the following improvements:

### 1. **Gemini API Integration Fixed**
- Fixed the `genAI` variable declaration order issue in `lib/gemini.ts`
- Added proper error handling for missing API keys
- Improved JSON parsing for AI responses

### 2. **API Route Syntax Errors Fixed**
- Fixed missing opening braces in all HTTP method handlers (POST, GET, PUT, DELETE)
- Added comprehensive error handling throughout the API

### 3. **Enhanced Error Handling**
- Added validation for document file paths
- Improved error messages for different failure scenarios
- Added database error handling
- Better validation for AI-generated flashcard data

### 4. **Performance Improvements**
- Added caching of extracted text in documents
- Improved content truncation for AI processing
- Better validation and filtering of flashcard data

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/studymate
MONGODB_DB_NAME=studymate

# Gemini AI Configuration (Required for flashcard generation)
GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
```

## Setup Instructions

### 1. **Get Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env.local` file

### 2. **Setup MongoDB**
1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env.local` file
3. Ensure the database is running

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Run the Development Server**
```bash
npm run dev
```

## API Endpoints

### Generate Flashcards
- **POST** `/api/flashcards`
- **Body**: `{ "documentId": "string", "count": number }`
- **Response**: `{ "success": true, "flashcards": [...], "count": number }`

### Get Flashcards
- **GET** `/api/flashcards?documentId=string&studyMode=boolean`
- **Response**: `{ "flashcards": [...] }`

### Update Flashcard
- **PUT** `/api/flashcards`
- **Body**: `{ "flashcardId": "string", "question": "string", "answer": "string", "difficulty": "string", "rating": "string" }`
- **Response**: `{ "success": true, "flashcard": {...} }`

### Delete Flashcard
- **DELETE** `/api/flashcards?id=string`
- **Response**: `{ "success": true }`

## Troubleshooting

### Common Issues

1. **"Missing GEMINI_API_KEY" Error**
   - Ensure you have set the `GEMINI_API_KEY` in your `.env.local` file
   - Restart the development server after adding the key

2. **"Document not found" Error**
   - Ensure the document exists and belongs to the authenticated user
   - Check that the document status is "completed"

3. **"Failed to extract text from PDF" Error**
   - Ensure the PDF file exists in the public/uploads/documents directory
   - Check file permissions

4. **"AI generated no flashcards" Error**
   - The document content might be too short or not suitable for flashcard generation
   - Try with a different document or increase the content length

### Testing the API

You can test the API endpoints using curl or any HTTP client:

```bash
# Test GET endpoint (requires authentication)
curl -X GET http://localhost:3000/api/flashcards

# Test POST endpoint (requires authentication and valid documentId)
curl -X POST http://localhost:3000/api/flashcards \
  -H "Content-Type: application/json" \
  -d '{"documentId": "your_document_id", "count": 10}'
```

## Features

- ✅ AI-powered flashcard generation using Gemini
- ✅ Spaced repetition system with review scheduling
- ✅ Difficulty-based categorization (easy, medium, hard)
- ✅ User rating system (again, hard, medium, easy)
- ✅ Document-based flashcard organization
- ✅ CRUD operations for flashcards
- ✅ Study mode with progress tracking
- ✅ Edit mode for manual flashcard management

## Next Steps

1. Set up your environment variables
2. Test the flashcard generation with a sample document
3. Verify the study mode functionality
4. Check the edit mode for manual flashcard management

The flashcards backend is now fully functional and ready for use!
