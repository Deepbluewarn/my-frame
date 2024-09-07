import { Button, Text } from '@mantine/core';

export default function AuthError() {
    return (
        <>
            <Text>인증 에러가 발생했어요</Text>
            <Button
                component='a'
                href='/api/auth/logout'
            >
                로그아웃
            </Button>
        </>
    )
}