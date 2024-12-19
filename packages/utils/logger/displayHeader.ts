import chalk from 'chalk';

type DisplayHeaderType = (labelBgColor: string, labelTextColor: string, activeTextColor: string) => void;

export const displayHeader: DisplayHeaderType = (labelBgColor, labelTextColor, activeTextColor) => {
  const block = chalk.bgHex(labelBgColor).hex(labelBgColor)('█');
  const stplrText = chalk.bgHex(labelBgColor).hex(labelTextColor)('stplr');
  const stplrLeft = chalk.bgHex(labelBgColor).hex(labelTextColor)(String.fromCharCode(9484));
  const stplrMiddle = chalk.bgHex(labelBgColor).hex(labelTextColor)(String.fromCharCode(9472));
  const stplrRight = chalk.bgHex(labelBgColor).hex(labelTextColor)(String.fromCharCode(9488));
  const triangle = chalk.hex(labelBgColor)(String.fromCharCode(9701));

  const logoLines = [
    `${block}${block}${block}${stplrLeft}${stplrMiddle}${stplrRight}${block}`,
    `${block}${stplrText}${block}`,
    `      ${triangle}`,
    `       `,
  ];

  const title = 'Stapler setup initialized';
  const subText1 = ' ';
  const subText2 = 'Everything is fine.';
  const subText3 = "I've done this like a million times.";

  const padding = 2;

  const output = [
    '', // Initial newline
    `  ${logoLines[0]}${' '.repeat(padding)}${chalk.hex(activeTextColor)(title)}`,
    `  ${logoLines[1]}${' '.repeat(padding)}${chalk.gray(subText1)}`,
    `  ${logoLines[2]}${' '.repeat(padding)}${chalk.gray(subText2)}`,
    `  ${logoLines[3]}${' '.repeat(padding)}${chalk.gray(subText3)}`,
    '',
  ].join('\n');

  console.log(output);
};
