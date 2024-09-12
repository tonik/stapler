## Getting Started

This is a jumpstart project for "Tonik app" using TurboRepo.

### Local Installation Steps

Before we refine and finish this project we aim for local development and testing.
This way we can use this repo on our local machine using `create-tonik-app create` command.

Here are the steps to get started:

```
pnpm install
```

```
pnpm build
```

```
cd packages/cli
npm link
```

Then you can run the following command to create a new project in desired directory on your local machine:

```
create-tonik-app create
```

Or you can do it in one simple command!

```
pnpm install && pnpm build --no-cache && mkdir -p project_template && cd packages/cli && npm link && cd ../../project_template/ && create-tonik-app create
```

## MVP Checklist

- [ ] Sync env variables with turbo after initalization
- [ ] Discover a way of packages installation to recreate the boring-stack project
- [ ] Include:
    - [ ] Turbo env variables
    - [ ] Establish our tooling packages with shared pnpm catalog workspec, this will include: 
          eslint, prettier, tailwind.
    - [] Supabase integration with authentication and payload cms working

