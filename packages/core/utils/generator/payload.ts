import { execSync } from "child_process";

const updatePackages = () => {
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
};

export const preparePayload = (template: string) => {
  console.log("Moving files to (app) directory...");
  if (template === "create-turbo") {
    process.chdir("./apps/web/");
    updatePackages();
    execSync(
      `mkdir -p ./app/\(app\) && find . -maxdepth 1 -exec mv {} ./app/\(app\)/ \;`,
      {
        stdio: "inherit",
      }
    );
  }
  if (template === "create-t3-app") {
    process.chdir("./src/");
    updatePackages();
    execSync(
      `mkdir -p ./app/\(app\) && find . -maxdepth 1 -exec mv {} ./app/\(app\)/ \;`,
      {
        stdio: "inherit",
      }
    );
  }

  console.log("Installing Payload to Next.js...");
  execSync(`npx create-payload-app@beta`, { stdio: "inherit" });

  console.log("Payload installed!");
};
