import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function testDeepseek() {
  try {
    const aiResponse = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Say hello!" }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );
    console.log("Success:", aiResponse.data.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

testDeepseek();
