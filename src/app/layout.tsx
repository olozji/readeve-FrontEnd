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
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6d8ac2fb0740657f1e67a9163c8b331b&autoload=false&libraries=services"></script>
        </LayOut>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
