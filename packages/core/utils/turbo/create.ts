import { execSync } from 'child_process';

export const createTurboRepo = async (name: string) => {
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
