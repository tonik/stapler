export const supabaseFiles = [
  {
    path: "supabase/src/",
    files: ["client.ts", "index.ts", "middleware.ts", "server.ts", "types.ts"],
  },
  {
    path: "supabase/",
    files: ["package"],
    rename: [
      {
        from: "package",
        to: "package.json",
      },
    ],
  },
];
