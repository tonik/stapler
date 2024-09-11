import { inngest } from './inngest';

export const helloWorld = inngest.createFunction(
  { name: 'Hello World' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-second', '1s');
    return { message: `Hello ${event.data.name}!` };
  }
);