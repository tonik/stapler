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

  execSync(`npx prettier --write "apps/web/**/*.{ts,tsx}"`, {
    stdio: "inherit",
  });
};
