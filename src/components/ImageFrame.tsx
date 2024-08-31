import { UploadContext } from '@/context/UploadContext';
import { ImageInterface } from '@/interface/Upload';
import Styles from '@/styles/components/ImageFrame.module.css'
import { Paper } from '@mantine/core';
import { useContext } from 'react';

export default function ImageFrame({ image } : { image: ImageInterface }) {
    const uploadContext = useContext(UploadContext);

    const handleImageClick = (image_key: string) => {
        uploadContext.setSelectedFileKey(image_key);
    }

    return (
        <Paper shadow="lg" className={Styles.container}>
            <img
                key={image.key}
                src={URL.createObjectURL(image.object)}
                alt={image.name}
                className={Styles.image}
                onClick={() => handleImageClick(image.key)}
            />
        </Paper>
    )
}
