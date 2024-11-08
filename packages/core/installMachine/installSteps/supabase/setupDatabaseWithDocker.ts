import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const setupDatabaseWithDocker = () => {
  logWithColoredPrefix('docker', 'Starting local Postgres...');

  try {
    execSync('docker -v', { stdio: 'ignore' });
  } catch (error) {
    console.error('Docker is not installed. Please install Docker and try again.');
    process.exit(1);
  }

  try {
    execSync('docker compose -f ./supabase/src/docker-compose.yml -p stapler up -d', { stdio: 'inherit' });
  } catch (error) {
    console.error(
      'Failed to start Docker Postgres container. Ensure Docker is running.',
      '\nDocker error message:',
      `\n${error}`,
    );
    process.exit(1);
  }
};
