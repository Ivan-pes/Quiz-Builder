import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiteNav } from '@/components/navigation';
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
  title: { template: '%s · Quiz Builder', default: 'Quiz Builder' },
  description:
    'Create quizzes with boolean, text and multiple-choice questions',
};

export const viewport: Viewport = {
  themeColor: '#a9cbe6',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        <SiteNav />
        <main className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
