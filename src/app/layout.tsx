import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilRootProvider from '../utils/recoilRootProvider'
import LoginBtn from "./components/buttons/LoginButton";
import LogoutButton from "./components/buttons/LogoutButton";

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
        <div>
          <LoginBtn></LoginBtn>
          <LogoutButton></LogoutButton>
        </div>
        <RecoilRootProvider>
          {children}
          </RecoilRootProvider>
      </body>
    </html>
  );
}
