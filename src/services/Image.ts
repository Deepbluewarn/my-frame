import Image, { ImageInterface } from "@/db/models/Image";

export async function createImage(image: ImageInterface) {
    return (await new Image(image)).save();
}

export async function getAllImagesByOwner(owner: string) {
    return (await Image.find({ owner }));
}

export async function getRecentImagesByOwner(owner: string, limit: number) {
    return (await Image.find({ owner }).sort({ createdAt: -1 }).limit(limit));
}

export async function getRecentPublicImages(limit: number) {
    return (await Image.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(limit));
}
