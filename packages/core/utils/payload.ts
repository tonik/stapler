import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { removeTurboFlag } from "./removeTurboFlag";

const updatePackages = () => {
  console.log(
    "🍸 Updating Next and React to their respective release candidates..."
  );
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc`, {
    stdio: "inherit",
  });

  console.log("🍸 Installing necessary packages...");
  execSync(`pnpm up pg`, {
    stdio: "inherit",
  });
};

export const preparePayload = () => {
  process.chdir("./apps/web/");
  updatePackages();

  // Payload doesn't work with Turbopack yet
  removeTurboFlag();

  console.log("🍸 Moving files to (app) directory...");
  execSync(
    `mkdir -p ./app/\\(app\\) && find ./app -maxdepth 1 ! -path './app' ! -path './app/\\(app\\)' -exec mv {} ./app/\\(app\\)/ \\;`,
    {
      stdio: "inherit",
    }
  );

  console.log("🍸 Installing Payload to Next.js...");
  execSync(`npx create-payload-app@beta`, { stdio: "inherit" });
  // TODO: change tsconfig to include the following:
  // "compilerOptions"."plugins"."paths": {"@payload-config": ["./payload.config.ts"]}
  // and change dev script from:
  // "dev": "next dev --turbo" to "dev": "next dev",

  // Check if the payload configuration file exists
  const payloadConfigPath = join(process.cwd(), "payload.config.ts");
  if (existsSync(payloadConfigPath)) {
    console.log("🍸 Payload installed successfully!");
  } else {
    console.error("🍸 Payload installation cancelled/failed.");
  }
};
