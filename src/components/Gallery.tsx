import { IGalleryFrame } from "@/interface/GalleryFrame";
import { Box } from "@mantine/core";
import Styles from '@/styles/components/Gallery.module.css';
import Link from "next/link";
import Image from "next/image";

export default function GalleryComponent({ images }: { images: IGalleryFrame[] }) {

    return (
        <Box className={Styles.container}>
            {images.map((image, index) => (
                <Box
                    key={index}
                    style={{ '--w': image.width, '--h': image.height }}
                    className={Styles.image_wrapper}
                >
                    <Link href={`/image/${image._id}`}>
                        <Image 
                            src={image.url} 
                            alt={image.title} 
                            width={image.width}
                            height={image.height}
                            className={Styles.image}
                        />
                    </Link>
                    
                </Box>
            ))}
        </Box>
    )
}
