import { ImageInterface } from "@/db/models/Image";
import { Box } from "@mantine/core";
import Styles from '@/styles/components/Gallery.module.css';

export default function GalleryComponent({ images }: { images: ImageInterface[] }) {
    return (

        <Box className={Styles.container}>
            {images.map((image, index) => (
                <Box
                    key={index}
                    style={{ '--w': image.width, '--h': image.height }}
                    className={Styles.image_wrapper}
                >
                    <img src={image.url} alt={image.title} className={Styles.image} />
                </Box>
            ))}
        </Box>
    )
}
