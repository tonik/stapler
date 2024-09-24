import { execSync } from "child_process";
import fs, { existsSync } from "fs";
import path, { join } from "path";
import { removeTurboFlag } from "../removeTurboFlag";

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

const prepareTsConfig = () => {
  console.log("🍸 Preparing tsconfig.json...");

  // Path to your tsconfig.json file
  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");

  // Read the tsconfig.json file
  fs.readFile(tsconfigPath, "utf8", (err, data) => {
    if (err) {
      console.error("🍸 Error reading tsconfig.json", err);
      return;
    }

    // Parse the JSON data
    const tsconfig = JSON.parse(data);

    // Ensure compilerOptions exists
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    // Add the "paths" field to compilerOptions if it doesn't exist
    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths = {};
    }

    // Append the "@payload-config" path
    tsconfig.compilerOptions.paths["@payload-config"] = ["./payload.config.ts"];

    // Write the updated tsconfig.json back to the file
    fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2), (err) => {
      if (err) {
        console.error("🍸 Error writing to tsconfig.json", err);
      }
    });
  });
};

export const preparePayload = () => {
  console.log("🍸 Initializing Payload...");
  prepareTsConfig();

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

  // Check if the payload configuration file exists
  const payloadConfigPath = join(process.cwd(), "payload.config.ts");
  if (!existsSync(payloadConfigPath)) {
    console.error("🍸 Payload installation cancelled/failed.");
  }
};
