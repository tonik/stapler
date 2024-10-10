import { execSync } from 'child_process';

export function checkGitHubAuth(): boolean {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

export function gitHubAuth(): boolean {
  try {
    execSync('gh auth login', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

export function getGitHubUsername(): string | null {
  try {
    return execSync('gh api user --jq .login').toString().trim();
  } catch (error) {
    return null;
  }
}

export function createGitHubRepository(projectName: string, repositoryVisibility: 'public' | 'private'): boolean {
  console.log(`Creating GitHub repository: ${projectName}`);
  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';

  try {
    const result = execSync(`gh repo create ${projectName} ${visibility} --confirm`, { stdio: 'pipe' }).toString();
    console.log(result);
    return true;
  } catch (error) {
    console.error('Failed to create GitHub repository.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    return false;
  }
}
