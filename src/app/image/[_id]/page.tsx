import Styles from '@/styles/components/imageDetails.module.css';
import { Box } from "@mantine/core";
import { actionGetSurroundingImagesById } from "@/actions/image";
import ImageDetails from "@/components/ImageDetails";
import { notFound } from 'next/navigation';
import { Types } from 'mongoose';
// https://github.com/vercel/next.js/discussions/18072
// https://medium.com/@moh.mir36/shallow-routing-with-next-js-v13-app-directory-2d765928c340
export default async function Page({ params }: { params: { _id: string } }) {
    // objectId 유효성 확인
    try {
        new Types.ObjectId(params._id);
    } catch(e) {
        notFound()
    }
    const images = await actionGetSurroundingImagesById(params._id, 2);

    if (!images || images.length === 0) notFound();

    return (
        <Box className={Styles.container}>
            <ImageDetails images={images}/>
        </Box>
    )
}
