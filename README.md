# Stapler CLI

**Stapler** is a CLI tool that scaffolds an entire fullstack app using a monorepo structure. It integrates **Next.js**, **Supabase**, **Payload CMS**, **Vercel**, and more, leveraging **Turbo** and **pnpm** to optimize your development workflow.

## Features

- **Fullstack scaffolding**: Quickly set up a monorepo with Next.js, Supabase, Payload CMS, and Vercel.
- **Monorepo**: Built-in support for managing multiple packages with Turbo and pnpm.
- **Customizable**: Easily extend the project with your own services or tools.

## Getting Started

### Local Installation for Development

If you'd like to develop or test Stapler locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/tonik/stapler.git
   cd stapler-cli
   ```

2. Install dependencies and build the project:

   ```bash
   pnpm install
   pnpm build
   ```

3. Link the CLI locally:

   ```bash
   cd packages/cli
   npm link
   ```

   Alternatively, run it all in one command:

   ```bash
   pnpm install && pnpm build --no-cache && cd packages/cli && npm link
   ```

### Usage

Once the CLI is linked, you can use it to create a new fullstack project by running:

```bash
create-stapler-app
```

This will scaffold a new project in your desired directory.
