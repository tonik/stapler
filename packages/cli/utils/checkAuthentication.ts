import { authenticateGitHub } from "stplr-core/installMachine/installSteps/github/repositoryManager";
import { authenticateSupabase } from 'stplr-core/installMachine/installSteps/supabase/authenticateSupabase';
import { authenticateVercel } from 'stplr-core/installMachine/installSteps/vercel/authenticateVercel';

export const checkAuthentication = async () => {
  await authenticateGitHub();
  await authenticateSupabase();
  await authenticateVercel();
};
