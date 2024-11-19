import Styles from '@/styles/home.module.css'
import { Button } from '@mantine/core'

export default function LoggedOut() {
    return (
        <div className={Styles.loggedOut}>
            <div className={Styles.heroTitle}>
                <h1>멋진 사진을 자랑해보세요!</h1>
            </div>
            <Button
                component='a'
                variant="white"
                color="black"
                size="md"
                href='/api/auth/signup'
            >
                시작하기
            </Button>
        </div>
    )
}
