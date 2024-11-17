import { getSession } from '@auth0/nextjs-auth0';
import LoggedOut from '@/components/LoggedOut';
import { Stack } from '@mantine/core';
import Styles from '@/styles/home.module.css'
import RecentPublicImageList from '@/components/RecentPublicImageList';

export default async function Home() {
  const session = await getSession();
  const user = session?.user;

  return (
    <>
      {
        user ? (
          <Stack className={Styles.recentImages}>
            <RecentPublicImageList />
          </Stack>
        ) : (
          <LoggedOut />
        )
      }
    </>
  )
}
