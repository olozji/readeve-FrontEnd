import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilRootProvider from '../utils/recoilRootProvider'
import LoginBtn from "./components/buttons/LoginButton";
import LogoutButton from "./components/buttons/LogoutButton";
import LayOut from "./components/Layout/Page";
import { Noto_Sans_KR } from 'next/font/google'; 
import Head from "next/head";

const notoSansKr = Noto_Sans_KR({
  weight: ['400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "읽는곳곳",
  description: "reading-everywhere",
  icons: {
    icon: "/mainIcon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <Head>
        <title>읽는곳곳</title>
        <meta name="description" content="독후감을 작성하고 공유하는 지도 서비스입니다." />
        <meta property="og:title" content="나만의 독후감 지도" />
        <meta property="og:description" content="독후감을 작성하고 공유하는 지도 서비스입니다." />
        <meta property="og:image" content="/public/images/mainTitle.png" />
        <meta
            name="viewport"
            content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width"
          />
      </Head>
      <body className={notoSansKr.className}>
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
