import { execSync } from "child_process";

export const prettify = () => {
  execSync(
    `echo "node_modules
    dist
    build
    .turbo
    payload-types.ts" > .prettierignore`,
    {
      stdio: "inherit",
    }
  );

  execSync(`pnpm format`, {
    stdio: "inherit",
  });
};
