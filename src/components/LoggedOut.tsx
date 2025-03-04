'use client'

import Styles from '@/styles/components/LoggedOut.module.css'
import {
    Button, Mark, Paper, Text,
    Table, TableTbody,
    TableTh, TableThead, TableTr, TableTd,
} from '@mantine/core'
import { useEffect, useRef } from 'react';

export default function LoggedOut() {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const testAccounts = [
        { email: 'test1@bluewarn.dev', password: '8&mvBF%&Z1xtKC' },
        { email: 'test2@bluewarn.dev', password: '$jh!0vfL@1@7t!' },
    ];
    const backgroundImages = [
        'https://myframe.s3.ap-northeast-2.amazonaws.com/winter-9416919.jpg_1740205259116',
        'https://myframe.s3.ap-northeast-2.amazonaws.com/DSC03061.jpg_1740208914706',
        'https://myframe.s3.ap-northeast-2.amazonaws.com/building-9340309.jpg_1740209479206',
        'https://myframe.s3.ap-northeast-2.amazonaws.com/paris-7539257.jpg_1740209414778',
    ]
    const rows = testAccounts.map((element) => (
        <TableTr key={element.email}>
            <TableTd>{element.email}</TableTd>
            <TableTd>{element.password}</TableTd>
        </TableTr>
    ));

    useEffect(() => {
        const el = backgroundRef.current;
        if (!el) {
            return;
        }

        const t = setInterval(() => {
            // el.scrollTo({
            //     top: el.scrollTop + el.clientHeight >= el.scrollHeight ? 0 : 1,
            //     behavior: "smooth",
            // })
        }, 6000);

        return () => {
            clearInterval(t);
        }
    }, [])

    return (
        <>
            <div className={Styles.background} ref={backgroundRef}>
                <div className={Styles['background-overlay']}></div>
                {
                    backgroundImages.map(i => <img key={i} src={i}></img>)
                }
            </div>

            <div className={`${Styles.message}`}>
                <h1 className={Styles['hero-title']}>멋진 <Mark color="red">사진</Mark>을 자랑해보세요!</h1>
                <Paper p={16}>
                    <Text>
                        아래의 테스트 계정을 사용할 수 있습니다.
                    </Text>
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>이메일</TableTh>
                                <TableTh>비밀번호</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                </Paper>
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
        </>
    )
}
