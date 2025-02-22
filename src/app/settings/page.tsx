import { Box, Flex, Text, Title } from "@mantine/core";
import Styles from '@/styles/home.module.css';
import ProfileAvatar from "@/components/ProfileAvatar";
import DeleteAccountModal from "@/components/DeleteAccountModal";

export default async function Settings() {
    return (
        <>
            <Box className={Styles.content}>
                <Flex direction='column' gap={40}>
                    <Title>설정</Title>

                    <Flex direction='column' gap={8}>
                        <Text>회원 프로필</Text>
                        <ProfileAvatar />
                    </Flex>

                    <Flex direction='column' gap={8}>
                        <Text>정보 수정</Text>
                        <Text c='dimmed'>프로필 사진, 닉네임 설정 기능 구현 예정</Text>
                    </Flex>

                    <Flex direction='column' gap={8}>
                        <Text>계정</Text>
                        <DeleteAccountModal />
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
