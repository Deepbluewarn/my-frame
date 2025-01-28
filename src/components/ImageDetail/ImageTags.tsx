import { useImageDetailStore } from "@/providers/image-detail-store-provider"
import { Pill, PillGroup, PillsInput } from "@mantine/core"
import { useState } from "react";

export default function ImageTags() {
    const ImageStoreAction = useImageDetailStore(store => store.actions);
    const currentImage = useImageDetailStore(store => store.currentImage);
    const [tagStrInput, setTagStrInput] = useState('');

    if (!currentImage) {
        return null;
    }

    const onImageTagEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        const target = e.currentTarget;

        await ImageStoreAction.tags.add(target.value);
        setTagStrInput('');
    }
    
    return (
        <PillsInput label="태그">
            <PillGroup>
                {
                    currentImage.tags.map(tag =>
                        <Pill
                            withRemoveButton
                            onRemove={() => ImageStoreAction.tags.remove(tag)}
                            key={tag}
                        >
                            {tag}
                        </Pill>
                    )
                }
                <PillsInput.Field
                    value={tagStrInput}
                    onChange={(e) => { setTagStrInput(e.target.value) }}
                    onKeyDown={onImageTagEnter}
                    placeholder="태그 추가 (공백으로 구분)"
                />
            </PillGroup>
        </PillsInput>
    )
}