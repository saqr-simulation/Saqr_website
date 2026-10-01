import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  icons: { icon: '/saqr-mark.svg' },
  title: {
    default: 'SAQR | Professional drone training',
    template: '%s | SAQR',
  },
  description:
    'Crash here, succeed there. Explore SAQR’s drone simulation and training platform, built in Morocco with agriculture as its first specialization.',
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
