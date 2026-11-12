import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://memory-heist-vocab.slowlyfaierman.chatgpt.site'),
  applicationName: 'Memory Heist',
  manifest: '/manifest.webmanifest',
  title: 'Memory Heist — Vocab Arcade',
  description: 'A fast, private vocabulary arcade for SAT and A-Level study.',
  openGraph: {
    title: 'Memory Heist — Vocab Arcade',
    description: 'Steal words from oblivion.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memory Heist — Vocab Arcade',
    description: 'Steal words from oblivion.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Memory Heist' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
