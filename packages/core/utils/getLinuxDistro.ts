import { execAsync } from './execAsync';

export const getLinuxDistro = async (): Promise<string> => {
  try {
    const osRelease = execAsync('cat /etc/os-release').toString();
    if (osRelease.includes('Ubuntu')) return 'ubuntu';
    if (osRelease.includes('Debian')) return 'debian';
    if (osRelease.includes('Fedora')) return 'fedora';
    if (osRelease.includes('CentOS')) return 'centos';
    if (osRelease.includes('Red Hat')) return 'rhel';
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
};
