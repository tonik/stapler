import { execSync } from "child_process";

export const updatePackages = () => {
  console.log("🍸 Installing necessary packages...");

  execSync(
    `pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc pg sharp`,
    {
      stdio: "inherit",
    }
  );
};
