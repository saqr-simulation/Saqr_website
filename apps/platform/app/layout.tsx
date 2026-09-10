import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: { default: 'SAQR | Pilot platform', template: '%s | SAQR' },
  description:
    'Train for the future of professional drone operations. Agriculture first.',
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
