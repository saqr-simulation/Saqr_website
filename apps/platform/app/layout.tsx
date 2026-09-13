import { Manrope, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'], 
  subsets: ['latin'], 
  variable: '--font-libre-baskerville' 
});

export const metadata: Metadata = {
  title: { default: 'SAQR | Pilot platform', template: '%s | SAQR' },
  description:
    'Train for the future of professional drone operations. Agriculture first.',
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${libreBaskerville.variable}`}>
      <body>{children}</body>
    </html>
  );
}
