import { execSync } from "child_process";

export const preparePayload = (template: string) => {
  console.log("Installing payload to Next.js...");
  execSync(`npx create-payload-app@beta`, { stdio: "inherit" });

  console.log(
    "Updating Next and React to their respective release candidates..."
  );
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc`, {
    stdio: "inherit",
  });

  console.log("Installing necessary packages...");
  execSync(`pnpm up pg`, {
    stdio: "inherit",
  });

  if (template === "create-turbo") {
    process.chdir("apps/web/app");
  }
  if (template === "create-t3-app") {
    process.chdir("src/app");
  }

  console.log("Moving files to (app) directory...");
  execSync(
    `mkdir -p \(app\) && find . -maxdepth 1 -exec mv {} ./\(app\)/ \;)`,
    {
      stdio: "inherit",
    }
  );

  console.log("Payload installed!");
};
