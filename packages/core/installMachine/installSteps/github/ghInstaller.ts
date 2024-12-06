import * as os from 'os';
import { execAsync } from '../../../utils/execAsync';
import { getLinuxDistro } from '../../../utils/getLinuxDistro';
import { logger } from '../../../../utils/logger';

export const isGitHubCLIInstalled = async (): Promise<boolean> => {
  try {
    await execAsync('gh --version');
    return true;
  } catch (error) {
    return false;
  }
};

export const installGitHubCLI = async (): Promise<boolean> => {
  const platform = os.platform();
  let installCommand: string;

  switch (platform) {
    case 'darwin': // macOS
      installCommand = 'brew install gh';
      break;
    case 'linux': // Linux
      const linuxDistro = await getLinuxDistro();
      if (linuxDistro === 'unknown') {
        logger.log('github', 'Automatic installation is not supported for your Linux distribution.');
      }
      if (linuxDistro === 'ubuntu' || linuxDistro === 'debian') {
        installCommand =
          'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 && sudo apt-add-repository https://cli.github.com/packages && sudo apt update && sudo apt install gh';
      } else if (linuxDistro === 'fedora' || linuxDistro === 'centos' || linuxDistro === 'rhel') {
        installCommand =
          'sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo && sudo dnf install gh';
      } else {
        logger.log('github', [
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
      logger.log('github', [
        'Automatic installation is not supported for your operating system.',
        '\nPlease visit https://github.com/cli/cli#installation for installation instructions.',
      ]);
      return false;
  }

  logger.log('github', 'Installing GitHub CLI...');
  try {
    await execAsync(installCommand);
    return true;
  } catch (error) {
    console.error('Failed to install GitHub CLI.');
    logger.log('github', 'Please install it manually from: https://github.com/cli/cli#installation');
    return false;
  }
};
