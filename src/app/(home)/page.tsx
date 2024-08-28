import Styles from '../../styles/home.module.css'
import { Button } from "@mantine/core";
import { IconBrandGithub, IconMail } from '@tabler/icons-react';

export default async function Home() {
  return (
    <>
      <main className={Styles.container}>
        <div className={Styles.heroTitle}>
          <h1>멋진 사진을 자랑해보세요!</h1>
        </div>
        <Button 
          variant="white"
          color="black"
          size="md"
        >
          시작하기
        </Button>
      </main>
      <footer className={Styles.footer}>
        <div>
          <p>사진을 공유할 수 있는 소셜 플랫폼 <b className={Styles.bold}>MY FRAME</b></p>
          <p>이 사이트는 개인 포트폴리오 제작을 목적으로 만들어졌습니다.</p>
        </div>
        <div className={Styles.social_links}>
          <ul>
            <li><IconMail /></li>
            <li><IconBrandGithub /></li>
          </ul>
        </div>
      </footer>
    </>
  )
}
