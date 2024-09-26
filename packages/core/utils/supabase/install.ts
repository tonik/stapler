import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";
import path from "path";

export const installSupabase = (destinationDirectory: string) => {
  console.log("🍸 Installing supabase-js..."); // create supabase
  execSync(`supabase init`, { stdio: "inherit" });
  process.chdir("supabase");
  execSync("pnpm init");
  console.log("🍸 Installing Supabase dependencies...");
  execSync(`pnpm install @supabase/supabase-js @supabase/ssr`, {
    stdio: "inherit",
  });
  console.log("🍸 Adding Supabase Files...");
  process.chdir("..");
  // Correctly set the template directory using __dirname
  const templateDirectory = path.join(__dirname, "../templates/supabase/files");

  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
};
