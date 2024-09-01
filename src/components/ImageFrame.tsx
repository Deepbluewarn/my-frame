import Styles from '@/styles/components/ImageFrame.module.css'
import { Paper } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

interface IImageFrame {
    selected: boolean,
    imageKey: string,
    objectURL: string,
    imageName: string
}
function ImageFrame(
    { selected, imageKey, objectURL, imageName }: IImageFrame) {

    const styles = [
        selected ? Styles.selected : '',
        Styles.container,
    ].join(' ');

    return (
        <Paper shadow="lg" className={styles}>
            <Image
                key={imageKey}
                src={objectURL}
                alt={imageName}
                width={0}
                height={0}
                className={Styles.image}
            />
        </Paper>
    )
}

export default React.memo(ImageFrame);
