import { execSync } from 'child_process';

export const createTurboRepo = async (name: string) => {
  console.log(`🖇️  Creating Turbo project "${name}"...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
