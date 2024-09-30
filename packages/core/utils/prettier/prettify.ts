import { execSync } from "child_process";

export const prettify = () => {
  console.log("🍸 Prettifying your Stapler...");

  const ignorePatterns = [
    "node_modules/",
    "dist/",
    "build/",
    ".turbo/",
    ".next/",
    "payload-types.ts",
  ];

  ignorePatterns.forEach((pattern) => {
    execSync(`echo ${pattern} >> .prettierignore`);
  });

  execSync(`pnpm format`, {
    stdio: "inherit",
  });
};