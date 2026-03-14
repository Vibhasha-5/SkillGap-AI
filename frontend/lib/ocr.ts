// ─── OCR & Document Text Extraction ─────────────────────────────────────────
// Supports: PDF, PNG, JPG, JPEG, WEBP, BMP, TIFF

export type FileType = "pdf" | "image" | "text" | "unsupported";

export function getFileType(file: File): FileType {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    type.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".bmp") ||
    name.endsWith(".tiff") ||
    name.endsWith(".tif")
  )
    return "image";
  if (
    type === "text/plain" ||
    name.endsWith(".txt") ||
    name.endsWith(".md")
  )
    return "text";
  return "unsupported";
}

// ─── Plain text ───────────────────────────────────────────────────────────────
export async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read text file."));
    reader.readAsText(file);
  });
}

// ─── PDF → text (via pdfjs-dist) ─────────────────────────────────────────────
export async function extractTextFromPDF(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // Use bundled worker via CDN to avoid webpack issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
    onProgress?.(Math.round((i / totalPages) * 80));
  }

  return fullText.trim();
}

// ─── Image → text (via Tesseract.js) ─────────────────────────────────────────
export async function extractTextFromImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const Tesseract = await import("tesseract.js");

  const worker = await Tesseract.createWorker("eng", 1, {
    logger: (m: any) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 90));
      }
    },
  });

  const url = URL.createObjectURL(file);
  try {
    const result = await worker.recognize(url);
    return result.data.text.trim();
  } finally {
    await worker.terminate();
    URL.revokeObjectURL(url);
  }
}

// ─── Unified extractor ────────────────────────────────────────────────────────
export async function extractText(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const type = getFileType(file);
  onProgress?.(5);

  if (type === "text") {
    const text = await extractTextFromTxt(file);
    onProgress?.(100);
    return text;
  }

  if (type === "pdf") {
    const text = await extractTextFromPDF(file, onProgress);
    onProgress?.(100);
    return text;
  }

  if (type === "image") {
    const text = await extractTextFromImage(file, onProgress);
    onProgress?.(100);
    return text;
  }

  throw new Error(
    "Unsupported file type. Please upload PDF, PNG, JPG, or TXT."
  );
}
