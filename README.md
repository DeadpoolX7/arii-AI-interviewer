# arii-AI Interview Coach

![Arii](./public/assets/arii-v2.png)

## Overview
A comprehensive AI-powered interview coaching platform that helps users prepare for technical and behavioral interviews by analyzing their resume and generating personalized interview questions.

## Features
- **Resume Upload & Analysis**: Extracts text from PDF resumes to provide context to the AI
- **Role Selection**: Users can select the role they're targeting for interview preparation
- **Question Generation**: AI (Gemini) generates technical and behavioral questions based on the user's resume and selected role
- **Answer Evaluation**: AI reviews submitted answers and provides:
  - Scores
  - Detailed feedback
  - Insights
  - Suggested improvements
  - Model answers

## Tech Stack
- **Frontend**: Next.js, shadcn
- **Backend**: Firebase
- **Cloud Storage**: Cloudinary
- **AI**: Google Gemini

## Team Members
- Sanju Shaw
- Priyanshu Shaw
- Sayan Dolui

## Project Flow
1. User uploads resume (PDF)
2. System extracts text from PDF
3. User selects target role and number of questions
4. AI generates interview questions
5. User answers questions
6. User submits answers
7. AI evaluates answers and provides feedback

## Setup Instructions
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Configure Firebase and Cloudinary credentials
4. Run the development server: `pnpm run dev`

## Architecture Diagram
```mermaid
flowchart TD
    A[User Uploads Resume] --> B[PDF Text Extraction]
    B --> C[User Selects Role]
    C --> D[AI Generates Questions]
    D --> E[User Answers Questions]
    E --> F[User Submits Answers]
    F --> G[AI Evaluates Answers]
    G --> H[Feedback Provided]
```

## UML Class Diagram
```mermaid
classDiagram
    class User {
        +String name
        +String email
        +uploadResume()
    }

    class Resume {
        +String textContent
        +extractText()
    }

    class InterviewSession {
        +String role
        +int questionCount
        +generateQuestions()
    }

    class Answer {
        +String content
        +submit()
    }

    class Feedback {
        +int score
        +String suggestions
        +generateFeedback()
    }

    User --> Resume
    User --> InterviewSession
    InterviewSession --> Answer
    Answer --> Feedback
```

## Contact
For any inquiries, please contact the team members listed above.