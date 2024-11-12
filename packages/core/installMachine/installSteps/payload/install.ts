import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path, { join } from 'path';
import chalk from 'chalk';
import { preparePayloadConfig } from './preparePayloadConfig';
import { prepareTsConfig } from './prepareTsConfig';
import { removeTurboFlag } from './removeTurboFlag';
import { updatePackages } from './updatePackages';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';
import { loadEnvFile } from './utils/loadEnvFile';

export const preparePayload = async () => {
  logWithColoredPrefix('payload', 'Initializing...');

  process.chdir('./apps/web/');

  prepareTsConfig();

  updatePackages();

  logWithColoredPrefix('payload', 'Moving files to (app) directory...');
  execSync(
    `mkdir -p ./app/\\(app\\) && find ./app -maxdepth 1 ! -path './app' ! -path './app/\\(app\\)' -exec mv {} ./app/\\(app\\)/ \\;`,
    { stdio: 'inherit' },
  );

  logWithColoredPrefix('payload', 'Installing to Next.js...');

  // Show the local Supabase connection string
  loadEnvFile(path.resolve('../../supabase/.env'));
  logWithColoredPrefix('postgres', `Local connection string: ${chalk.cyan(process.env.DB_URL)}`);

  // Install Payload
  execSync('npx create-payload-app@beta --db postgres', { stdio: 'inherit' });

  // Payload doesn't work with Turbopack yet
  removeTurboFlag();

  // Check if the payload configuration file exists
  const payloadConfigPath = join(process.cwd(), 'payload.config.ts');
  if (!existsSync(payloadConfigPath)) {
    console.error('Payload installation cancelled/failed.');
  } else {
    await preparePayloadConfig(payloadConfigPath);
  }

  // Return to the root directory
  process.chdir('../../');
};
