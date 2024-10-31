import { execSync } from 'child_process';
import gradient from 'gradient-string';

const payloadGradient = gradient([
  { color: '#12324A', pos: 0 },
  { color: '#E5AA5F', pos: 1 },
]);

export const updatePackages = () => {
  console.log(payloadGradient('Updating Next and React to their respective release candidates...'));
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc --reporter silent`, {
    stdio: 'inherit',
  });

  console.log(payloadGradient('Installing necessary packages...'));
  execSync(`pnpm i pg sharp --reporter silent`, {
    stdio: 'inherit',
  });
};
