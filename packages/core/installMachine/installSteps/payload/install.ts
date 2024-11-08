import { prepareTsConfig } from './prepareTsConfig';
import { updatePackages } from './updatePackages';
import { moveFilesToAppDir } from './moveFilesToAppDir';
import { runInstallCommand } from './runInstallCommand';
import { createMigration } from './createMigration';
import { updatePackageJson } from './updatePackageJson';
import { preparePayloadConfig } from './preparePayloadConfig';

export const preparePayload = async () => {
  process.chdir('./apps/web/');

  await prepareTsConfig();
  await updatePackages();
  await moveFilesToAppDir();
  await runInstallCommand();
  await createMigration();
  await updatePackageJson();
  await preparePayloadConfig();

  process.chdir('../../');
};
