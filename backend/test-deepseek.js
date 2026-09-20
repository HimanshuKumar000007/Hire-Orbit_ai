import dotenv from "dotenv";
import { ai, NVIDIA_DEFAULT_MODEL } from "./lib/ai.js";

dotenv.config();

async function testNvidiaAI() {
  try {
    console.log("Testing NVIDIA AI NIM with model:", NVIDIA_DEFAULT_MODEL);
    const response = await ai.chat.completions.create({
      model: NVIDIA_DEFAULT_MODEL,
      messages: [{ role: "user", content: "Say hello from NVIDIA AI for HireOrbitAi!" }]
    });
    console.log("✅ Success:", response.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
    } else {
      console.error("❌ Network / Client Error:", error.message);
    }
  }
}

testNvidiaAI();
