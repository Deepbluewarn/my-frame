import '../styles/global.css'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "My Frame",
  description: "사진을 등록하고 슬라이드를 볼 수 있는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <UserProvider>
        <body>
          <MantineProvider>
            <Header fixed={true} />
            {children}
          </MantineProvider>
        </body>
      </UserProvider>
    </html>
  );
}
