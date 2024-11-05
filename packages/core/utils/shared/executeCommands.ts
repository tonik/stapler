import { execSync } from 'node:child_process';

export const executeCommands = (commands: string[]) => {
  for (const cmd of commands) {
    const result = execSync(cmd, { stdio: 'pipe' });
    if (!result) {
      console.error(`Failed to execute command: ${cmd}`);
      process.exit(1);
    }
  }
};
