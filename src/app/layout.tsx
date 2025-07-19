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
import { UserInfoStoreProvider } from '@/providers/userid-store-provider';
import { actionGetUserIdBySub } from '@/actions/user';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: `${process.env.NODE_ENV === 'development' ? '[DEV]' : ''} THE FRAME`,
  description: "사진 공유 플랫폼 THE FRAME",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;
  const userId = await actionGetUserIdBySub(user?.sub);

  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <UserInfoStoreProvider value={{ _id: userId || '', sub: user?.sub}}>
        <UserProvider>
          <body>
            <MantineProvider>
              <Header fixed={true} />
              <main className={`${HomeStyles.container}`}>
                {children}
              </main>
              <footer className={HomeStyles.footer}>
                <div>
                  <p><b>THE FRAME</b></p>
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
      </UserInfoStoreProvider>
    </html>
  );
}
