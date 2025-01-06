import { Text, Button, Flex } from '@mantine/core';
import { ImageWithOwner } from "@/services/Image";
import { actionDeleteImages } from '@/actions/image';

export default function DeleteConfirmation(
    {
        selectedImages, done,
    }:
        {
            selectedImages: ImageWithOwner[], done: (refresh?: boolean) => void,
        }
) {

    const deleteImages = async () => {
        const res = await actionDeleteImages(
            selectedImages.map(i => i._id),
        );

        if (res) {
            alert('사진이 삭제되었습니다.');
            done(true);
        }
    }

    return (
        <>
            <Text>{selectedImages.length}개의 사진을 삭제합니다.</Text>
            <Flex justify='flex-end' gap={8}>
                <Button color='gray' onClick={() => done()}>취소</Button>
                <Button color='red' onClick={deleteImages}>삭제</Button>
            </Flex>
        </>
    )
}