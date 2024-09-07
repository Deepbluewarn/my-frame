import Styles from '@/styles/home.module.css'
import { Button } from '@mantine/core'

export default function LoggedOut() {
    return (
        <>
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
        </>
    )
}
