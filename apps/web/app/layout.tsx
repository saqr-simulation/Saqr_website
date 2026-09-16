import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'SAQR | Professional drone training',
    template: '%s | SAQR',
  },
  description:
    'Train for the future of professional drone operations. Agriculture first.',
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
