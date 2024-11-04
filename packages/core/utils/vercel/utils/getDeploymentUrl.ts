import { execSync } from 'child_process';

export const getDeploymentUrl = (): string => {
  const command = 'vercel --prod';

  try {
    const output = execSync(command, {
      stdio: ['inherit', 'pipe', 'inherit'],
      encoding: 'utf8',
    });

    if (output) {
      return output;
    } else {
      console.error(`URL not found in production deployment output`);
      return '';
    }
  } catch (error) {
    console.error(`Error during production deployment:`, error);
    return '';
  }
};
