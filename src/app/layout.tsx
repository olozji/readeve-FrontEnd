import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilRootProvider from '../utils/recoilRootProvider'
import LoginBtn from "./components/buttons/LoginButton";
import LogoutButton from "./components/buttons/LogoutButton";
import LayOut from "./components/Layout/Page";

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
        <LayOut>
          
          {children} 
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ed0400bf5dc9c6b6a4e99d63d27799a4&autoload=false&libraries=services"></script>
        </LayOut>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
