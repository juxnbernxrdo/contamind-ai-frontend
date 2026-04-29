import type {Metadata} from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument',
});

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'ContaMind AI',
  description: 'Contabilidad que piensa contigo.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${geist.variable}`}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
