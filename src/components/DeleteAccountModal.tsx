'use client'

import { _actionDeleteImages, _actionDeleteS3Images, _actionGetuserImages } from "@/actions/image";
import { actionUserSelfDelete } from "@/actions/user";
import { useUserInfoStore } from "@/providers/userid-store-provider";
import { Button, Flex, Modal, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";

export default function DeleteAccountModal() {
    const userId = useUserInfoStore(store => store._id);
    const [opened, { open, close }] = useDisclosure(false);

    const requestDeleteUser = async () => {
        const res = await actionUserSelfDelete(userId);

        alert(res ? '회원 탈퇴가 완료되었습니다.' : '문제가 발생했습니다.')

        location.href = '/api/auth/logout';
        close();
    }
    return (
        <>

            <Modal opened={opened} onClose={close} title="계정 삭제">
                <Flex direction='column' gap={8}>
                    <Text>계정을 삭제하면 사진이 모두 삭제되며, 댓글과 좋아요 기록은 삭제되지 않습니다.</Text>

                    <Button onClick={requestDeleteUser} color="red">계정 삭제</Button>
                </Flex>

            </Modal>
            <Button onClick={open} color="red">계정 삭제</Button>
        </>
    )
}