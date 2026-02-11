import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WakeUp DAO - 用区块链战胜起床困难症',
  description: '通过质押 ETH 和智能合约的强制力，帮助你养成早起习惯',
  keywords: ['Web3', 'DAO', '早起', '习惯养成', '区块链'],
  authors: [{ name: 'WakeUp DAO Team' }],
  openGraph: {
    title: 'WakeUp DAO',
    description: '用区块链的力量，帮你战胜起床困难症',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
