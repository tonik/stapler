import { execSync } from "child_process";

export const prettify = () => {
  console.log("🍸 Prettifying your Stapler...");

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
