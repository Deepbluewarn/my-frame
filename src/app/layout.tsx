import '../styles/global.css'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from '@/components/Header/Header';
import HomeStyles from '@/styles/home.module.css'
import { IconMail, IconBrandGithub } from '@tabler/icons-react';
import { getSession } from '@auth0/nextjs-auth0';
import { UserIdStoreProvider } from '@/providers/userid-store-provider';
import { actionGetUserIdBySub } from '@/actions/user';

export const metadata: Metadata = {
  title: "My Frame",
  description: "사진을 등록하고 슬라이드를 볼 수 있는 서비스입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;
  const userId = await actionGetUserIdBySub();

  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <UserIdStoreProvider value={{ _id: userId || '' }}>
        <UserProvider>
          <body>
            <MantineProvider>
              <Header fixed={true} />
              <main className={`${HomeStyles.container} ${!user ? HomeStyles.background : ''}`}>
                {children}
              </main>
              <footer className={HomeStyles.footer}>
                <div>
                  <p>사진을 공유할 수 있는 소셜 플랫폼 <b className={HomeStyles.bold}>MY FRAME</b></p>
                  <p>이 사이트는 개인 포트폴리오 제작을 목적으로 만들어졌습니다.</p>
                </div>
                <div className={HomeStyles.social_links}>
                  <ul>
                    <li><IconMail /></li>
                    <li><IconBrandGithub /></li>
                  </ul>
                </div>
              </footer>
            </MantineProvider>
          </body>
        </UserProvider>
      </UserIdStoreProvider>
    </html>
  );
}
