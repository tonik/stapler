import { prepareTsConfig } from './prepareTsConfig';
import { updatePackages } from './updatePackages';
import { moveFilesToAppDir } from './moveFilesToAppDir';
import { runInstallCommand } from './runInstallCommand';
import { updatePackageJson } from './updatePackageJson';
import { preparePayloadConfig } from './preparePayloadConfig';
import { createMigration } from './createMigration';
import { updateTurboJson } from './updateTurboJson';

export const preparePayload = async () => {
  process.chdir('./apps/web/');

  await prepareTsConfig();
  await updatePackages();
  await moveFilesToAppDir();
  await runInstallCommand();
  await updatePackageJson();
  await preparePayloadConfig();
  await createMigration();

  process.chdir('../../');

  await updateTurboJson();
};
