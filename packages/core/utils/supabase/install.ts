import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";
import path from "path";
import { dir } from "console";

export const installSupabase = (destinationDirectory: string) => {
  console.log("🍸 Installing supabase-js...");  // create supabase
  const supabaseDir = path.join(destinationDirectory, "supabase");
  execSync(`supabase init`, { cwd: supabaseDir, stdio: "inherit" });
  process.chdir(supabaseDir);
  execSync('pnpm init -y');
  console.log("🍸 Installing Supabase dependencies...");
  execSync(`pnpm install @supabase/supabase-js @supabase/ssr`, {
    cwd: supabaseDir,
    stdio: "inherit",
  });
  console.log("🍸 Adding Supabase Files...");
  process.chdir("..");
  // Correctly set the template directory using __dirname
  const templateDirectory = path.join(__dirname, "../templates/supabase/files");

  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
  console.log(`🍸 Supabase installed successfully!`);
};
