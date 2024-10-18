# My Fullstack App

This project was generated using the **Stapler CLI**. It sets up a fullstack monorepo with **Next.js**, **Supabase**, **Payload CMS**, and more, leveraging **Turbo** and **pnpm** to streamline your development workflow.

### Key Directories

- **apps/web**: This is the main frontend for your project. Built with Next.js, it also optionally integrates **Payload CMS** for content management.
- **apps/docs**: This could serve as your project's documentation site or any other static content site.
- **supabase**: Contains the configuration and code for Supabase, which serves as your project's backend (database, authentication, and API).
- **packages**: Shared utilities, TypeScript configurations, ESLint rules, and UI components that can be reused across different apps.

## Getting Started

### Prerequisites

Ensure that you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version >= 16)
- [pnpm](https://pnpm.io/installation) (package manager)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [GitHub CLI](https://cli.github.com/) (for repo management)

### Install Dependencies

To install all the necessary dependencies across the monorepo, run:

```bash
pnpm install
```

## Running the Project

### Frontend (Next.js)

To start the `web` app (frontend):

```bash
cd apps/web
pnpm dev
```

This will launch the Next.js frontend on `http://localhost:3000`.

### Documentation (Optional)

To start the documentation site (if configured):

```bash
cd apps/docs
pnpm dev
```

This will run the documentation app at `http://localhost:3001`.

### Supabase Backend

To start the backend server with Supabase:

```bash
cd supabase
supabase start
```

This will launch Supabase services locally, including the database and API.

## Environment Variables

Next.js and Supabase environment variables are automatically stored in the `.env` file in the project's root folder.
Payload CMS environment variables are generated in `apps/web`.

## Development Workflow

### Turbo Tasks

The monorepo uses **Turbo** to manage and speed up tasks across different apps. To see the available tasks, run:

```bash
pnpm turbo run
```

You can execute tasks like building, linting, or testing across all apps simultaneously.
Linting

To lint the entire project with ESLint:

```bash
pnpm lint
```

### Building for Production

To create a production build of the project:

```bash
pnpm build
```

## Project Structure

Refer to the [ARCHITECTURE](ARCHITECTURE.md) document for an in-depth overview of the project structure.

## Customization

You can extend the project by:

- Adding new apps: Create a new directory in apps/ and set up another service (e.g., a mobile app).

  To add your own `packages` and `apps`, run:

  ```bash
  pnpm turbo gen workspace
  ```

- Adding Payload CMS collections: Modify the `payload.config.ts` file in `apps/web` to add new content types.
- Customizing Supabase: Write custom SQL queries or functions in Supabase.
