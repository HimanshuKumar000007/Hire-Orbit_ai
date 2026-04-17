import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function extractText(file) {
  const filePath = file.path;
  const mimetype = file.mimetype;

  console.log("📄 Extracting text from:", filePath, "(", mimetype, ")");

  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    try {
      // ✅ Back to standard pdf-parse 1.1.1 API
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (err) {
      console.error("PDF extraction error:", err.message);
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  } else if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (err) {
      console.error("DOCX extraction error:", err.message);
      throw new Error(`DOCX parsing failed: ${err.message}`);
    }
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }
}
