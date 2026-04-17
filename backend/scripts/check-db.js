import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  console.log("🧪 Testing insert into password_resets...");
  
  const { data, error } = await supabase
    .from("password_resets")
    .insert([{
      email: "test-diagnostic@gmail.com",
      token: "test-token-123",
      expires_at: new Date(Date.now() + 1000 * 60).toISOString()
    }]);

  if (error) {
    console.error("❌ Insert failed:", error.message);
    if (error.message.includes("does not exist")) {
      console.log("👉 Suggestion: Create the 'password_resets' table in Supabase.");
    }
  } else {
    console.log("✅ Insert successful! Connection and key are perfect.");
    // Cleanup
    await supabase.from("password_resets").delete().eq("email", "test-diagnostic@gmail.com");
  }
}

testInsert();
