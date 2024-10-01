import { 
    Flex, Text, Button, Avatar
} from "@mantine/core";

export default async function ProfileAvatar({
    name, picture, followers, following
}: {
    name: string, picture: string, followers: number, following: number,
}) {
    return (
        <Flex gap={8}>
            <Avatar src={picture} alt={name} />
            <Flex direction='column' gap={8}>
                <Flex align={'center'} gap={16}>
                    <Text component="div" style={{
                        maxWidth: '10rem',
                        wordBreak: 'break-word',
                    }}>{name}</Text>
                    <Button>팔로우</Button>
                </Flex>
                <Flex gap={16}>
                    <Text>{`${followers} 팔로워`}</Text>
                    <Text>{`${following} 팔로잉`}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
