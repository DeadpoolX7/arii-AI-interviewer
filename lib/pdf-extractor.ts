// PDF text extraction utility
export const extractTextFromPDF = async (file: File): Promise<{ text: string; error: string | null }> => {
  try {
    // For now, we'll use a simple approach with PDF.js
    // In a real implementation, you might want to use a server-side solution
    const pdfjsLib = await import("pdfjs-dist")

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }

    return { text: fullText.trim(), error: null }
  } catch (error: any) {
    console.error("PDF extraction error:", error)
    return {
      text: "",
      error: "Failed to extract text from PDF. Please ensure the file is a valid PDF document.",
    }
  }
}

// Fallback text extraction for when PDF.js fails
export const extractTextFallback = (fileName: string): string => {
  return `Resume uploaded: ${fileName}. Please manually enter key skills and experience for better interview questions.`
}
