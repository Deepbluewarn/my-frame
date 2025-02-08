import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { List, Text } from "@mantine/core";

export default function ImageAttributes() {
    const currentImage = useImageDetailStore(store => store.currentImage);

    if (!currentImage) {
        return null;
    }

    return (
        <List>
            <Text fw={700}>이미지 정보</Text>
            {
                process.env.NODE_ENV === 'development' ? (
                    <List.Item>_id: {currentImage._id}</List.Item>
                ) : null
            }
            <List.Item>너비: {currentImage.width}px</List.Item>
            <List.Item>높이: {currentImage.height}px</List.Item>
            <List.Item>업로드 날짜: {
                new Intl.DateTimeFormat('ko-KR',
                    { timeZone: 'Asia/Seoul', dateStyle: 'full', timeStyle: 'short' }
                ).format(new Date(currentImage.uploadedAt))
            }
            </List.Item>
        </List>
    )
}