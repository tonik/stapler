import { execSync } from 'child_process';
import * as os from 'os';
import { getLogColor } from '../shared/getLogColor';

export const isGitHubCLIInstalled = (): boolean => {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

export const installGitHubCLI = (): boolean => {
  const platform = os.platform();
  let installCommand: string;

  switch (platform) {
    case 'darwin': // macOS
      installCommand = 'brew install gh';
      break;
    case 'linux': // Linux
      const linuxDistro = getLinuxDistro();
      if (linuxDistro === 'ubuntu' || linuxDistro === 'debian') {
        installCommand =
          'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 && sudo apt-add-repository https://cli.github.com/packages && sudo apt update && sudo apt install gh';
      } else if (linuxDistro === 'fedora' || linuxDistro === 'centos' || linuxDistro === 'rhel') {
        installCommand =
          'sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo && sudo dnf install gh';
      } else {
        getLogColor('github', [
          'Automatic installation is not supported for your Linux distribution.',
          '\n Please visit https://github.com/cli/cli#installation for installation instructions.',
        ]);
        return false;
      }
      break;
    case 'win32': // Windows
      installCommand = 'winget install --id GitHub.cli';
      break;
    default:
      getLogColor('github', [
        'Automatic installation is not supported for your operating system.',
        '\nPlease visit https://github.com/cli/cli#installation for installation instructions.',
      ]);
      return false;
  }

  getLogColor('github', 'Installing GitHub CLI...');
  try {
    execSync(installCommand, { stdio: 'inherit' });
    getLogColor('github', 'GitHub CLI installed successfully.');
    return true;
  } catch (error) {
    console.error('Failed to install GitHub CLI.');
    getLogColor('github', 'Please install it manually from: https://github.com/cli/cli#installation');
    return false;
  }
};

export const getLinuxDistro = (): string => {
  try {
    const osRelease = execSync('cat /etc/os-release').toString();
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
