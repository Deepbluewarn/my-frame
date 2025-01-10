'use client'

import { Button } from "@mantine/core"

export default function UnauthenticatedHeader() {
    return (
        <>
            <Button
                component='a'
                href='/api/auth/login'
            >
                로그인
            </Button>
        </>
    )
}
