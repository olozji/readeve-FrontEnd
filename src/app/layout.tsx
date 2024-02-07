import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilRootProvider from '../utils/recoilRootProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "읽는곳곳",
  description: "reading-everywhere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRootProvider>
          {children}
          </RecoilRootProvider>
      </body>
    </html>
  );
}
