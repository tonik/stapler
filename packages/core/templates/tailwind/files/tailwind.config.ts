import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...fontFamily.sans],
        mono: ['var(--font-playfair)', ...fontFamily.mono],
      },
    },
  },
} satisfies Config;
