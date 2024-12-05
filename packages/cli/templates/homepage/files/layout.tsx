import type { Metadata } from 'next';
import { Roboto, Playfair_Display } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Welcome to Stapler',
  description: 'Experience the future of organization with Stapler',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
