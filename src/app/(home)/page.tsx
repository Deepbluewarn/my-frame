import { getSession } from '@auth0/nextjs-auth0';
import LoggedOut from '@/components/LoggedOut';

export default async function Home() {
  const session = await getSession();
  const user = session?.user;

  return (
    <>
      {
        user ? (
          null
        ) : (
          <LoggedOut />
        )
      }
    </>
  )
}
