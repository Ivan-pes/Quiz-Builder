import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
