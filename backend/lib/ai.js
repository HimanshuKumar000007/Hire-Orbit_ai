import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const NVIDIA_DEFAULT_MODEL = "meta/llama-3.2-11b-vision-instruct";

// Configure OpenAI client for NVIDIA NIM / AI Foundation Endpoints
export const ai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "placeholder-set-NVIDIA_API_KEY-in-env",
  baseURL: "https://integrate.api.nvidia.com/v1",
});
