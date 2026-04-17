import fs from 'fs';
import path from 'path';

async function testUpload() {
  const filePath = 'node_modules/mammoth/test/test-data/strikethrough.docx';
  
  const formData = new FormData();
  
  // Use a Blob instead of fs directly if running in modern node
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  formData.append("resume", blob, "strikethrough.docx");
  formData.append("jobDescription", "Electrical Engineer");

  try {
    const res = await fetch("http://localhost:5001/upload-resume", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testUpload();
