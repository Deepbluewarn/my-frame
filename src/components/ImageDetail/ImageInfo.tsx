import { Avatar, Flex, Text } from "@mantine/core";
import Styles from '@/styles/components/imageDetails.module.css';
import Link from "next/link";
import ImageSummary from "./ImageSummary";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";

export default function ImageInfo() {
    const ImageStore = useImageDetailStore(store => store);

    if (!ImageStore.currentImage) {
        return null;
    }

    return (
        <Flex className={Styles.profile_container} gap={16}>
            <Avatar
                size="lg"
                src={ImageStore.currentImage.ownerDetails.profilePicture}
                alt={ImageStore.currentImage.ownerDetails.username}
                radius="xl"
            />

            <Flex direction={'column'} gap={8} style={{ width: '100%' }}>
                <Link href={`/user/${ImageStore.currentImage.ownerDetails._id}`} target="_blank">
                    <Text fw={700}>{ImageStore.currentImage.ownerDetails.username}</Text>
                </Link>

                <ImageSummary />
            </Flex>
        </Flex>
    )
}