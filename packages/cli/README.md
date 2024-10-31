# Create Stapler App 🖇️

**Stapler** is a CLI tool that scaffolds an entire fullstack app.
It integrates **Next.js**, **Supabase**, **Vercel**, and more, just by running a single command.
The CLI guides you through the setup process and helps you create a new project in minutes.
You don't have to be an expert to get started with Stapler.
This amazing tool is brought to you by awesome [**Tonik**](https://www.tonik.com/) engineer team.

## Requirements

### System

- node.js
- pnpm (for managing the monorepo in scaffolded project)
- gh cli (will be installed automatically if not found)
- vercel cli (will be installed automatically if not found)
- docker (optional), if you want to use Supabase locally

### Accounts

- supabase account (https://supabase.com/)
- vercel account (https://vercel.com/)

## Key Features:

- Scaffolds a fullstack monorepo with the latest packages.
- Integrates Next.js, Supabase, Payload CMS, and Vercel.
- Provides a guided setup process for Supabase, GitHub, and Vercel.

## Getting Started

To create a new project, run the following command:

```bash
npx @tonik/create-stapler-app
```

This command will guide you through the setup process and create a new project in the current directory.

## Project Structure

```bash
/my-stapled-app
.
├── .env  # Contains all the environment variables.
├── README.md  # Main project documentation file explaining overall usage and features.
├── apps       # Contains all the main application code (frontend or backend).
│   ├── docs   # Documentation app, possibly a Next.js site or documentation tool.
│   │   ├── README.md           # Documentation for the `docs` app itself.
│   │   ├── app                 # Main Next.js `app` directory.
│   │   ├── next-env.d.ts       # TypeScript definitions for Next.js.
│   │   ├── next.config.mjs     # Configuration for the Next.js app.
│   │   ├── package.json        # Dependencies and scripts for the `docs` app.
│   │   ├── public              # Public static files (e.g., images, icons) for the `docs` app.
│   │   └── tsconfig.json       # TypeScript configuration for the `docs` app.
│   └── web    # The main web app of the project, likely built with Next.js and Payload CMS.
│       ├── README.md           # Documentation specific to the `web` app.
│       ├── app                 # Main directory for the `web` app.
│       │   ├── (app)           # Main directory for the Next.js app.
│       │   ├── (payload)       # Main directory for the Payload CMS app.
│       │   └── my-route        # Example route created by Payload.
│       ├── collections         # Payload CMS collections for managing database entities.
│       ├── next-env.d.ts       # TypeScript definitions for Next.js.
│       ├── next.config.mjs     # Configuration for the Next.js `web` app.
│       ├── package.json        # Dependencies and scripts for the `web` app.
│       ├── payload-types.ts    # Auto-generated TypeScript types based on Payload CMS collections.
│       ├── payload.config.ts   # Payload CMS configuration file.
│       ├── public              # Public static files (e.g., images, fonts) for the `web` app.
│       └── tsconfig.json       # TypeScript configuration for the `web` app.
├── package.json  # Root project dependencies and scripts (workspace-wide or shared).
├── packages      # Reusable packages or configurations shared across apps.
│   ├── eslint-config          # ESLint configuration for linting the project.
│   │   ├── README.md           # Documentation for the ESLint configuration package.
│   │   ├── library.js          # ESLint rules for JavaScript libraries.
│   │   ├── next.js             # ESLint rules for Next.js apps.
│   │   ├── package.json        # Dependencies for the ESLint configuration package.
│   │   └── react-internal.js   # ESLint rules for React-related code.
│   ├── typescript-config      # Shared TypeScript configuration across different apps.
│   │   ├── base.json           # Base TypeScript configuration.
│   │   ├── nextjs.json         # TypeScript configuration specific to Next.js.
│   │   ├── package.json        # Package.json for the TypeScript configuration package.
│   │   └── react-library.json  # TypeScript configuration for React libraries.
│   └── ui                     # Reusable UI components or shared UI library.
│       ├── package.json        # Dependencies for the `ui` package.
│       ├── src                 # Source code for shared UI components.
│       ├── tsconfig.json       # TypeScript configuration for the `ui` package.
│       ├── tsconfig.lint.json  # TypeScript configuration for linting purposes.
│       └── turbo               # Turbo configuration for optimizing builds in the `ui` package.
├── pnpm-lock.yaml              # Lock file for pnpm, ensures consistency across installations.
├── pnpm-workspace.yaml         # Configuration file for managing the pnpm workspace.
├── supabase                    # Contains code and configuration for the Supabase backend.
│   ├── config.toml             # Supabase configuration file.
│   ├── package.json            # Dependencies and scripts for the Supabase backend.
│   ├── seed.sql                # SQL seed file for initializing the database.
│   └── src                     # Source code for Supabase-related server and client logic.
│       ├── client.ts           # Supabase client setup.
│       ├── index.ts            # Main entry point for Supabase backend.
│       ├── middleware.ts       # Middleware logic for handling requests.
│       ├── server.ts           # Server-side logic for Supabase.
│       └── types.ts            # TypeScript types for Supabase-related entities.
└── turbo.json                  # Turbo configuration for managing and optimizing monorepo tasks.

```

## Key Libraries

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Payload CMS](https://payloadcms.com/)
