import { getSession } from '@auth0/nextjs-auth0';
import LoggedOut from '@/components/LoggedOut';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    redirect('/explore/public')
  }

  return <LoggedOut />
}
