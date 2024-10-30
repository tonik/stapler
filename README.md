# Stapler CLI 🖇️

This is a monorepo for our **Stapler** [CLI tool](https://www.npmjs.com/package/@tonik/create-stapler-app) that scaffolds an entire fullstack app using a monorepo structure. It integrates **Next.js**, **Supabase**, **Payload CMS**, **Vercel**, and more, leveraging **Turbo** and **pnpm** to optimize your development workflow.

## Requirements

- node.js
- npx
- pnpm

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

Once the CLI is linked, you can use it to create a new fullstack project by running:

```bash
@tonik/create-stapler-app
```

This will scaffold a new project in the directory you're currently in.

### Versioning

We use [Changesets](https://github.com/changesets/changesets) for versioning.
Currently, we're developing the alpha version of the CLI, so the versioning is not yet stable.

#### Creating a New Version

When you're ready to create a new version, run the following command:

```bash
pnpm changeset
```

This will run a guided process to create a new version.
In the process you would be asked to select the type of the change (patch, minor, major) and write a summary of the changes.
The next step is to run the following command:

```bash
pnpm changeset version
```

This will create the neccessary changeset files and update the version in the `package.json` files.
When those changes will be pushed to the repository and merged to the `main` branch, the CI will automatically publish the new version to the npm registry.

## Project Structure

```bash
── ARCHITECTURE.md # Detailed overview of the scaffolded project structure
├── README.md
├── package.json # Main package.json for the monorepo
├── packages # Monorepo packages
│   ├── cli # Main CLI package
│   └── core # Core package with installation logic
│       ├── CHANGELOG.md
│       ├── templates # Templates for the scaffolded project
│       └── utils # Core functions
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json
```

## Scaffolded Project Structure

Refer to the [ARCHITECTURE](ARCHITECTURE.md) document for an in-depth overview of the scaffolded project structure.

## Troubleshooting

### GitHub Authentication Issue:

If the CLI hangs during the `gh auth login` step, verify that the GitHub CLI is installed and authenticated properly. You can check the [GitHub CLI documentation](https://cli.github.com/) for assistance.
