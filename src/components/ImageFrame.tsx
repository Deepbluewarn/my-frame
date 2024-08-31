import Styles from '@/styles/components/ImageFrame.module.css'
import { Paper } from '@mantine/core';
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
            <img
                key={imageKey}
                src={objectURL}
                alt={imageName}
                className={Styles.image}
            />
        </Paper>
    )
}

export default React.memo(ImageFrame);
