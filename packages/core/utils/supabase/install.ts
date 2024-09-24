import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";
import path from 'path';

export const installSupabase = (templateDirectory: string, destinationDirectory: string) => {
  console.log("🍸 Installing supabase-js...");
  execSync(`pnpm install @supabase/supabase-js`, { stdio: 'inherit' });
  console.log('🍸 Adding Supabase Files...');
  execSync(`supabase init`, { stdio: 'inherit' });

  // Correctly set the template directory
  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
  console.log(`🍸 Supabase installed successfully!`)
};