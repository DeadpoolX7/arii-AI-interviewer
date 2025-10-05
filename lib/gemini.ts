import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export const generateInterviewQuestions = async (
  resumeText: string,
  role: string,
  technicalCount: number,
  behavioralCount: number,
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert technical interviewer. I need you to generate interview questions based on a resume and role.
VERY IMPORTANT: You must respond ONLY with a valid JSON object - no additional text, no markdown formatting.

Resume Text:
${resumeText}

Role: ${role}

Generate:
- ${technicalCount} technical questions
- ${behavioralCount} behavioral questions

Return EXACTLY this JSON structure and nothing else:
{
  "technical": [
    {"id": "tech_1", "question": "question text", "type": "technical"}
  ],
  "behavioral": [
    {"id": "behav_1", "question": "question text", "type": "behavioral"}
  ]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response text of any potential formatting
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    try {
      const questionsData = JSON.parse(cleanedText)
      
      // Validate response structure
      if (!questionsData.technical || !questionsData.behavioral) {
        throw new Error('Invalid response structure')
      }

      const allQuestions = [...questionsData.technical, ...questionsData.behavioral]
      return { questions: allQuestions, error: null }
    } catch (parseError) {
      console.error("Parsing error:", parseError, "\nRaw response:", text)
      return {
        questions: [],
        error: "Failed to parse questions. Please try again."
      }
    }
  } catch (error: any) {
    console.error("Gemini API error:", error)
    return {
      questions: [],
      error: "Failed to generate questions. Please try again."
    }
  }
}

export const evaluateAnswers = async (
  questions: Array<{ id: string; question: string; type: string }>,
  answers: string[],
  role: string,
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const questionsAndAnswers = questions.map((q, index) => ({
      question: q.question,
      answer: answers[index] || "No answer provided",
      type: q.type,
    }))

    const prompt = `
You are an expert interviewer evaluating candidate responses for a ${role} position.

Please evaluate the following questions and answers:

${questionsAndAnswers
  .map(
    (qa, index) => `
Question ${index + 1} (${qa.type}): ${qa.question}
Answer: ${qa.answer}
`,
  )
  .join("\n")}

For each answer, provide:
1. A score from 1-10 (10 being excellent)
2. Detailed feedback explaining the score
3. Suggestions for improvement

Return the response as a JSON object with this exact structure:
{
  "evaluations": [
    {
      "score": 8,
      "feedback": "detailed feedback text",
      "suggestions": "improvement suggestions"
    }
  ],
  "overallScore": 7.5,
  "overallFeedback": "general feedback about the interview performance"
}

Make sure the JSON is valid and properly formatted.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response text of any potential formatting
    const cleanedText = text
      .replace(/```json\s*/g, '')  // Remove ```json with any whitespace
      .replace(/```\s*/g, '')      // Remove ``` with any whitespace
      .replace(/^\s+|\s+$/g, '')   // Trim whitespace
      .trim()

    try {
      const evaluationData = JSON.parse(cleanedText)

      // Validate the response structure
      if (!evaluationData.evaluations || !Array.isArray(evaluationData.evaluations) || 
          typeof evaluationData.overallScore !== 'number' || 
          typeof evaluationData.overallFeedback !== 'string') {
        throw new Error('Invalid evaluation data structure')
      }

      return {
        evaluations: evaluationData.evaluations,
        overallScore: evaluationData.overallScore,
        overallFeedback: evaluationData.overallFeedback,
        error: null,
      }
    } catch (parseError) {
      console.error("Parsing error:", parseError, "\nRaw response:", text)
      return {
        evaluations: [],
        overallScore: 0,
        overallFeedback: "",
        error: "Failed to parse evaluation results. Please try again.",
      }
    }
  } catch (error: any) {
    console.error("Gemini evaluation error:", error)
    return {
      evaluations: [],
      overallScore: 0,
      overallFeedback: "",
      error: "Failed to evaluate answers. Please try again.",
    }
  }
}
