import { execSync } from "child_process";

export const updatePackages = () => {
  console.log(
    "🍸 Updating Next and React to their respective release candidates..."
  );
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc`, {
    stdio: "inherit",
  });

  console.log("🍸 Installing necessary packages...");

  execSync(
    `pnpm i payload@beta @payloadcms/next@beta @payloadcms/richtext-lexical@beta @payloadcms/db-postgres pg sharp`,
    {
      stdio: "inherit",
    }
  );
};
