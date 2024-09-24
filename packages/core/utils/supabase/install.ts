import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";
import path from 'path';

export const installSupabase = () => {
  console.log("🍸 Installing supabase-js...");
  execSync(`pnpm install @supabase/supabase-js`, { stdio: 'inherit' });
  console.log('🍸 Adding Supabase Files...');
  execSync(`supabase init`, { stdio: 'inherit' });

  // Correctly set the template directory
  const templateDirectory = path.join(__dirname, '../../templates/supabase/files');
  templateGenerator(supabaseFiles, templateDirectory);
  console.log(`🍸 Supabase installed successfully!`)
};