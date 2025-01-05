import { useState } from 'react';
import { ImageWithOwner } from '@/services/Image';

export function useImageSelection() {
    const [selectedImageList, setSelectedImageList] = useState<ImageWithOwner[]>([]);

    const toggleSelection = (image?: ImageWithOwner) => {
        setSelectedImageList(prevList => {
            const selImage = image;

            if (!selImage) {
                return prevList;
            }
            let newList;
            if (prevList.some(image => image._id === selImage._id)) {
                newList = prevList.filter(image => image._id !== selImage._id);
            } else {
                newList = [...prevList, selImage];
            }
            return newList;
        });
    };

    const reset = () => {
        setSelectedImageList([]);
    }

    return { selectedImageList, toggleSelection, reset };
}
