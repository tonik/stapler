export const continueOnKeypress = async (question: string) => {
  console.log(`${question}`);

  process.stdin.setRawMode(true);
  return new Promise<void>((resolve) => {
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });
};
