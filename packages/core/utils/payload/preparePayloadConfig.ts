import fs from "fs";
import path from "path";

export const preparePayloadConfig = () => {
  console.log("🍸 Preparing payload.config.ts...");

  // Path to your payload.config.ts file
  const configPath = path.join(process.cwd(), "payload.config.ts");

  // Read the payload.config.ts file
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error("🍸 Error reading payload.config.ts", err);
      return;
    }

    // Use regex to find the "db" object and append "schemaName: 'payload'" to the pool configuration
    const updatedConfig = data.replace(
      /pool:\s*{[^}]*connectionString[^}]*}/,
      (match) => {
        if (match.includes("schemaName")) {
          return match; // If "schemaName" already exists, return the match unchanged
        }
        // Add schemaName within the pool configuration
        return match.replace(/}/, `, schemaName: 'payload' }`);
      }
    );

    // Write the updated payload.config.ts back to the file
    fs.writeFile(configPath, updatedConfig, (err) => {
      if (err) {
        console.error("🍸 Error writing to payload.config.ts", err);
      }
    });
  });
};
