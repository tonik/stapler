# Stapler CLI 🖇️

**Stapler** is a CLI tool that scaffolds an entire fullstack app using a monorepo structure. It integrates **Next.js**, **Supabase**, **Payload CMS**, **Vercel**, and more, leveraging **Turbo** and **pnpm** to optimize your development workflow.

## Requirements
- node.js
- npx

## Features

- **Fullstack scaffolding**: Quickly set up a monorepo with Next.js, Supabase, Payload CMS, and Vercel.
- **Monorepo**: Built-in support for managing multiple packages with Turbo and pnpm.
- **Customizable**: Easily extend the project with your own services or tools.

## Basic CLI Information

This CLI tool automates the setup of fullstack apps with Next.js, Supabase, Payload CMS, and Vercel, and efficiently manages monorepos with Turbo and pnpm.

### Key Features:

- Scaffolds a fullstack monorepo with the latest packages.
- Integrates Next.js, Supabase, Payload CMS, and Vercel.
- Uses pnpm for fast dependency management.
- Automates GitHub repository creation and GitHub authentication using the GitHub CLI.

## Getting Started

### Local Installation for Development

If you'd like to develop or test Stapler locally, follow these steps:

```bash
# Clone the repository:
git clone https://github.com/tonik/stapler.git
cd stapler-cli

# Install dependencies and build the project:
pnpm install
pnpm build

# Link the CLI locally:
cd packages/cli
npm link
```

### Running the CLI

Once the CLI is linked, you can use it to create a new fullstack project by running:

```bash
create-stapler-app
```

This will scaffold a new project in the directory you're currently in.

## Project Structure

Refer to the [ARCHITECTURE](ARCHITECTURE.md) document for an in-depth overview of the scaffolded project structure.

## Troubleshooting

### GitHub Authentication Issue:

If the CLI hangs during the `gh auth login` step, verify that the GitHub CLI is installed and authenticated properly. You can check the [GitHub CLI documentation](https://cli.github.com/) for assistance.
