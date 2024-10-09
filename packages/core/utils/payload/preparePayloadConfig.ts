import fs from "fs";

export const preparePayloadConfig = (configPath: fs.PathOrFileDescriptor) => {
  console.log("🍸 Preparing payload.config.ts...");

  // Read the payload.config.ts file
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error("🍸 Error reading payload.config.ts", err);
      return;
    }

    // Use regex to find the "pool" object and append "schemaName: 'payload'" to the pool configuration
    const updatedConfig = data.replace(
      /pool:\s*{([^}]*)connectionString[^}]*}/,
      (match, group1) => {
        if (match.includes("schemaName")) {
          return match; // If "schemaName" already exists, return the match unchanged
        }
        // Append schemaName to the existing pool configuration (avoiding the extra comma)
        return match.replace(
          group1.trimEnd(),
          `${group1.trimEnd()} schemaName: 'payload',\n`
        );
      }
    );

    // Write the updated payload.config.ts back to the file
    fs.writeFile(configPath, updatedConfig, (err) => {
      if (err) {
        console.error("🍸 Error writing to payload.config.ts", err);
      } else {
        console.log("🍸 payload.config.ts updated successfully!");
      }
    });
  });
};
