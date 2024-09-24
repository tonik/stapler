import fs from "fs";
import path from "path";

export const removeTurboFlag = () => {
  // Path to your package.json file
  const packageJsonPath = path.join(process.cwd(), "package.json");

  // Read the package.json file
  fs.readFile(packageJsonPath, "utf8", (err: Error | null, data: string) => {
    if (err) {
      console.error("Error reading package.json", err);
      return;
    }

    // Parse the JSON data
    const packageJson = JSON.parse(data);

    // Remove '--turbo' flag from the "dev" script
    if (packageJson.scripts && packageJson.scripts.dev) {
      packageJson.scripts.dev = packageJson.scripts.dev
        .replace("--turbo", "")
        .trim();
    }

    // Write the updated package.json back to the file
    fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      (err: Error | null) => {
        if (err) {
          console.error("Error writing to package.json", err);
        } else {
          console.log("Successfully removed --turbo flag from dev script!");
        }
      }
    );
  });
};
