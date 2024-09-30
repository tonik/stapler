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
      console.log("🍸 Add gin and lime juice...");
      setTimeout(() => {
        console.log("🍸 Topping with Tonik...");
        setTimeout(() => {
          console.log("🍸 Garnishing with lime wedge...");
          setTimeout(() => {
            console.log(`🍸 Your Stapled ${getName(name)} is ready!`);
            // I'm too lazy to mess with modules building to allow coloring library to be installed lol
            console.log(`🍸 You can now run:`);
            console.log(
              `\x1b[36m%s\x1b[0m`,
              `🍸 cd ${name} && pnpm dev`,
              `\x1b[0m`
            );
            console.log("I'm last");
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }, 100);
};
