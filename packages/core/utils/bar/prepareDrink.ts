const getName = (name: string) => {
  if (!name) {
    return ".";
  }

  return name;
};

export const prepareDrink = (name: string) => {
  setTimeout(() => {
    console.log("🍸 Filling a high ball glass with ice...");
    setTimeout(() => {
      console.log("🍸 Adding gin and lime juice...");
      setTimeout(() => {
        console.log("🍸 Topping with", "\x1b[34mTonik\x1b[0m", "...");

        setTimeout(() => {
          console.log("🍸 Garnishing with lime wedge...");
          setTimeout(() => {
            console.log(
              `\x1b[32m%s\x1b[0m`,
              `🍸 Your Stapled ${getName(name)} is ready!`,
              `\x1b[0m`
            );
            // I'm too lazy to mess with modules building to allow coloring library to be installed lol
            console.log(
              `🍸 You can now run: \x1b[36m%s\x1b[0m cd ${name} && pnpm dev\x1b[0m.`
            );
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};
