import fs from 'fs';

export const loadEnvFile = (filePath: fs.PathOrFileDescriptor) => {
  const envData = fs.readFileSync(filePath, 'utf-8');
  envData.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
};
