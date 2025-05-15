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
    <html lang="en">
      <body className={`${delight.variable} antialiased`}>
        <Providers>
          <div className="relative z-10 w-full h-100vh">
            {children}
            <footer className="text-center text-sm text-white/80">
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
          <div className="gradient-bg fixed inset-0 z-0 w-100vw h-100vh animate-color-transition" />
          <div className="gradient-bg-2 fixed inset-0 z-0 w-100vw h-100vh animate-color-transition-layer-2" />
        </Providers>
      </body>
    </html>
  );
}
