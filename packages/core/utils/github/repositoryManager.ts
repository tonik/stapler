import { execSync } from 'child_process';

function executeCommand(command: string, silent = false): string | null {
  try {
    return execSync(command, { stdio: silent ? 'ignore' : 'pipe' })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

export function isGitHubAuthenticated(): boolean {
  return !!executeCommand('gh auth status', true);
}

export function authenticateGitHub(): boolean {
  return !!executeCommand('gh auth login', true);
}

export function fetchGitHubUsername(): string | null {
  return executeCommand('gh api user --jq .login');
}

export function createGitHubRepository(projectName: string, repositoryVisibility: 'public' | 'private'): boolean {
  console.log(`Creating GitHub repository: ${projectName}`);
  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';
  const result = executeCommand(`gh repo create ${projectName} ${visibility} --confirm`);

  if (result) {
    console.log(result);
    return true;
  }

  console.error('Failed to create GitHub repository.');
  return false;
}
