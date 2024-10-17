import { execSync } from 'child_process';

export function getDeploymentUrl(production: boolean = false): string {
  const command = production ? 'vercel --prod' : 'vercel';

  try {
    const output = execSync(command, { encoding: 'utf8' });
    // Look for a line that starts with "Preview:" or "Production:" followed by a URL
    const urlMatch = output.match(production ? /Production:.*?(https:\/\/\S+)/ : /Preview:.*?(https:\/\/\S+)/);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1].trim();
    } else {
      console.error(`URL not found in ${production ? 'production' : 'preview'} deployment output`);
      return '';
    }
  } catch (error) {
    console.error(`Error during ${production ? 'production' : 'preview'} deployment:`, error);
    return '';
  }
}
