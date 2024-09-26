import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { removeTurboFlag } from "./removeTurboFlag";
import { prepareTsConfig } from "./prepareTsConfig";
import { updatePackages } from "./updatePackages";
import { preparePayloadConfig } from "./preparePayloadConfig";

export const preparePayload = () => {
  console.log("🍸 Initializing Payload...");

  process.chdir("./apps/web/");

  prepareTsConfig();

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
  execSync(`pnpm dlx create-payload-app@beta`, { stdio: "inherit" });

  // Check if the payload configuration file exists
  const payloadConfigPath = join(process.cwd(), "payload.config.ts");
  if (!existsSync(payloadConfigPath)) {
    console.error("🍸 Payload installation cancelled/failed.");
  } else {
    preparePayloadConfig(payloadConfigPath);
  }
  // get back to the root directory
  process.chdir("../../");
};
