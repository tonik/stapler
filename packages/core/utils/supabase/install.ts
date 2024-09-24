import { execSync } from "child_process";
import { templateGenerator } from "../generator/generator";
import { supabaseFiles } from "../../templates/supabase/installConfig";

export const installSupabase = () => {
    console.log("🍸 Installing supabase-js...");
    execSync(`npm install @supabase/supabase-js`, { stdio: 'inherit' });
    console.log('🍸 Adding Supabase Files...');
    execSync(`supabase init`, { stdio: 'inherit' });
    const projectDirectory = process.cwd();
    templateGenerator(supabaseFiles, projectDirectory);
    console.log(`🍸 Supabase installed successfully!`)
}