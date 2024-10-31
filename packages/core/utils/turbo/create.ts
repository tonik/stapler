import { execSync } from 'child_process';
import gradient from 'gradient-string';

const turborepoGradient = gradient([
  { color: '#0099F7', pos: 0 },
  { color: '#F11712', pos: 1 },
]);

export const createTurboRepo = async (name: string) => {
  console.log(turborepoGradient('Creating Turborepo...'));
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
