import { homedir } from 'os';
import fs from 'fs';
import path from 'path';

const getXDGPaths = (appName: string) => {
  const homeDir = homedir();

  if (process.platform === 'win32') {
    // Windows paths, typically within %AppData%
    return {
      dataDirs: [path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), appName)],
      configDirs: [path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), appName)],
      cacheDir: path.join(process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local'), appName, 'Cache'),
    };
  } else if (process.platform === 'darwin') {
    // macOS paths, typically in ~/Library/Application Support
    return {
      dataDirs: [path.join(homeDir, 'Library', 'Application Support', appName)],
      configDirs: [path.join(homeDir, 'Library', 'Application Support', appName)],
      cacheDir: path.join(homeDir, 'Library', 'Caches', appName),
    };
  } else {
    // Linux/Unix paths, following the XDG Base Directory Specification
    return {
      dataDirs: [process.env.XDG_DATA_HOME || path.join(homeDir, '.local', 'share', appName)],
      configDirs: [process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config', appName)],
      cacheDir: process.env.XDG_CACHE_HOME || path.join(homeDir, '.cache', appName),
    };
  }
};

// Returns whether a directory exists
const isDirectory = (path: string): boolean => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (_) {
    // We don't care which kind of error occured, it isn't a directory anyway.
    return false;
  }
};

// Returns in which directory the config should be present
export const getGlobalPathConfig = async (appName: string): Promise<string> => {
  const vercelDirectories = getXDGPaths(appName).dataDirs;

  const possibleConfigPaths = [
    ...vercelDirectories, // latest vercel directory
    path.join(homedir(), '.now'), // legacy config in user's home directory
    ...getXDGPaths('now').dataDirs, // legacy XDG directory
  ];

  return possibleConfigPaths.find((configPath) => isDirectory(configPath)) || vercelDirectories[0];
};
