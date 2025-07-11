import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const delight = localFont({
  src: [
    {
      path: './fonts/Delight-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Delight-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Delight-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Delight-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Delight-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-delight',
});

export const metadata: Metadata = {
  title: 'Solana Spaces',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="gradient-bg">
      <body className={`${delight.variable}`}>
        <Providers>
          <div className="relative z-10 w-full">
            <div className='flex flex-col items-center justify-center'>
            {children}
            </div>
            <footer className="text-center text-sm text-white/80 pt-6 py-8">
              <p>
                <a
                  href="https://solanaspaces.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &copy; {new Date().getFullYear()} Solana Spaces
                </a>
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
