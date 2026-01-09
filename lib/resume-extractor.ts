// lib/resume-extractor.ts

let pdfjsLib: any = null;
let tesseractWorker: any = null;

// Lazy load PDF.js only on client
const getPdfJs = async () => {
  if (typeof window === 'undefined') return null;
  if (pdfjsLib) return pdfjsLib;
  
  try {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    return pdfjsLib;
  } catch (err) {
    console.error('Failed to load PDF.js:', err);
    return null;
  }
};

// Lazy load Tesseract only on client
const getTesseractWorker = async () => {
  if (typeof window === 'undefined') return null;
  if (tesseractWorker) return tesseractWorker;
  
  try {
    const { createWorker, PSM } = await import('tesseract.js');
    tesseractWorker = { createWorker, PSM };
    return tesseractWorker;
  } catch (err) {
    console.error('Failed to load Tesseract:', err);
    return null;
  }
};

/**
 * Unified text extraction for resumes
 * - TXT: direct read
 * - Images (png/jpg/jpeg): Tesseract OCR
 * - PDF: Try native text first → fallback to OCR if empty/low text
 */
export const extractTextFromResume = async (
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<{ text: string; error: string | null }> => {
  try {
    if (typeof window === 'undefined') {
      return { text: "", error: "Text extraction only works on client side" };
    }

    onProgress?.(0, "Starting extraction...");

    // TXT files - fastest
    if (file.type === "text/plain") {
      const text = await file.text();
      return { text, error: null };
    }

    // Try native PDF text first
    if (file.type === "application/pdf") {
      onProgress?.(20, "Trying native PDF text extraction...");
      
      const pdfModule = await getPdfJs();
      if (!pdfModule) {
        return { text: "", error: "PDF library not available" };
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfModule.getDocument({ data: arrayBuffer }).promise;

      let nativeText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        nativeText += pageText + "\n";
      }

      // If we got decent text (>200 chars), use it
      if (nativeText.trim().length > 200) {
        return { text: nativeText.trim(), error: null };
      }

      onProgress?.(40, "Native text low → running OCR on PDF pages...");
    } else if (!file.type.startsWith("image/")) {
      return { text: "", error: "Unsupported file type" };
    }

    // OCR path: Images or scanned PDFs
    const tesseractModule = await getTesseractWorker();
    if (!tesseractModule) {
      return { text: "", error: "OCR library not available" };
    }

    const { createWorker, PSM } = tesseractModule;
    const worker = await createWorker();

    await worker.load();
    await worker.reinitialize("eng");
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD,
    });

    let fullText = "";

    if (file.type.startsWith("image/")) {
      // Direct image OCR
      onProgress?.(50, "Running OCR on image...");
      const { data } = await worker.recognize(file);
      fullText = data.text;
      onProgress?.(90, "OCR complete...");
    } else {
      // Scanned PDF: render pages to canvas → OCR each
      const pdfModule = await getPdfJs();
      if (!pdfModule) {
        await worker.terminate();
        return { text: "", error: "PDF library not available" };
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfModule.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        onProgress?.(40 + (50 * (i / pdf.numPages)), `OCR page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const scale = 2.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d")!;
        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const { data } = await worker.recognize(canvas.toDataURL("image/png"));
        fullText += data.text + "\n\n";
      }
    }

    await worker.terminate();
    return { text: fullText.trim(), error: null };
  } catch (err: any) {
    console.error("Extraction error:", err);
    return { text: "", error: err.message || "Extraction failed" };
  }
};

// Fallback message
export const extractTextFallback = (fileName: string): string => {
  return `Resume uploaded: ${fileName}. Text extraction failed — please manually enter key details for better results.`;
};