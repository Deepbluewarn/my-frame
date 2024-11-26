import { actionGetPublicImages } from "@/actions/image";
import GalleryList from "@/components/GalleryList";
import Styles from '@/styles/home.module.css'
import { Stack, Text } from "@mantine/core";

export default function ExplorePublicImages() {
    return (
        <Stack className={Styles.recentImages}>
            <Text fw={700} size="xl">최근 업로드 된 사진</Text>
            <GalleryList actionLoad={actionGetPublicImages} initialParams={{
                limit: 4
            }}/>
        </Stack>
    )
}