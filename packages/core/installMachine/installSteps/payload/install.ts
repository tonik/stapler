import { preparePayloadConfig } from './preparePayloadConfig';
import { prepareTsConfig } from './prepareTsConfig';
import { removeTurboFlag } from './removeTurboFlag';
import { updatePackages } from './updatePackages';
import { moveFilesToAppDir } from './moveFilesToAppDir';
import { runInstallCommand } from './runInstallCommand';

export const preparePayload = async () => {
  process.chdir('./apps/web/');

  await prepareTsConfig();
  await updatePackages();
  await moveFilesToAppDir();
  await runInstallCommand();
  await removeTurboFlag();
  await preparePayloadConfig();

  process.chdir('../../');
};
