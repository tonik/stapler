import * as fs from "fs";
import * as path from "path";

const requiredEnvVariables: Record<string, "required" | "optional"> = {
  NEXT_PUBLIC_SUPABASE_URL: "required",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "required",
  SUPABASE_URL: "required",
  SUPABASE_ANON_KEY: "required",
  SUPABASE_JWT_SECRET: "required",
  SUPABASE_SERVICE_ROLE_KEY: "required",
  // DATABASE_URI:"required", // this is created by Payload in web app directory
  // PAYLOAD_SECRET:"required", // this is created by Payload in web app directory
  // INNGEST_API_KEY: "required",
  // INNGEST_API_SECRET: "optional",
};

// Path to the .env file
const envPath = path.resolve(process.cwd(), ".env");

// Function to create .env file with empty fields
export const createEnvFile = () => {
  console.log("🍸 Creating .env file...");
  let envTemplate = "";
  for (const [key, status] of Object.entries(requiredEnvVariables)) {
    envTemplate += `${key}=\n`;
  }

  fs.writeFileSync(envPath, envTemplate);
};
