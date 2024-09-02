import Image, { ImageInterface } from "@/db/models/Image";

export async function createImage(image: ImageInterface) {
    return (await new Image(image)).save();
}
