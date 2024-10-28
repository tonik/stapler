import { execSync } from 'child_process';

export const getDeploymentUrl = (production: boolean = false): string => {
  const command = production ? 'vercel --prod' : 'vercel';

  try {
    const output = execSync(command, {
      stdio: ['inherit', 'pipe', 'inherit'],
      encoding: 'utf8',
    });

    if (output) {
      return output;
    } else {
      console.error(`URL not found in ${production ? 'production' : 'preview'} deployment output`);
      return '';
    }
  } catch (error) {
    console.error(`Error during ${production ? 'production' : 'preview'} deployment:`, error);
    return '';
  }
};
