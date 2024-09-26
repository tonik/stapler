import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";
import path from 'path';

export const installSupabase = (destinationDirectory: string) => {
  console.log("🍸 Installing supabase-js...");
  // install with pnpm with workspace support/flag
  execSync(`pnpm install -w @supabase/supabase-js`, { stdio: 'inherit' });
  console.log('🍸 Adding Supabase Files...');
  execSync(`supabase init`, { stdio: 'inherit' });

  // Correctly set the template directory using __dirname
  const templateDirectory = path.join(__dirname, "../templates");

  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
  console.log(`🍸 Supabase installed successfully!`)
};
