import chalk from 'chalk';

const getName = (name: string) => {
  if (!name) {
    return '.';
  }

  return name;
};

export const prepareDrink = (name: string) => {
  setTimeout(() => {
    console.log('🍸 Filling a high ball glass with ice...');
    setTimeout(() => {
      console.log('🍸 Adding gin and lime juice...');
      setTimeout(() => {
        console.log('🍸 Topping with', chalk.blue('Tonik') + '...');
        setTimeout(() => {
          console.log('🍸 Garnishing with lime wedge...');
          setTimeout(() => {
            console.log(chalk.green(`🍸 Your Stapled ${getName(name)} is ready!`));
            console.log(`🍸 You can now run:`, chalk.cyan(`cd ${name} && pnpm dev`));
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};
