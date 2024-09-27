'use server';
import { ImageInterface, MetaFileInterface } from "@/interface/Upload";
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0";
import { createImage } from "@/services/Image";
import { getImageDimensions } from "@/utils/file";
import { addImageToUser, getUserBySub } from "@/services/User";
import connectDB from '@/db/init';
import { Types } from "mongoose";

// AWS S3 설정
const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },

    region: process.env.AWS_REGION
});

async function uploadImageToS3(file: File) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${file.name}`,
        Body: buffer,
        ContentType: file.type
    };

    return await new Upload({
        client: s3,
        params
    }).done();
}

export const UploadAction = async (metadata: ImageInterface[] | null, data: FormData) => {
    await connectDB();
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    if (!metadata) {
        return { success: false, error: 'Metadata not found' };
    }
    
    let metaFiles: MetaFileInterface[] = [];

    for (const e of metadata) {
        const fileObject = Array.from(data.entries()).find(([key, file]) => {
            if (file instanceof File) {
                return e.originalFileName === decodeURIComponent(key);
            }
        });
        const metadata = e as MetaFileInterface;

        if (!fileObject) return;

        const fileObj = fileObject[1] as File;
        const dimensions = await getImageDimensions(fileObj);

        metadata.fileObject = fileObj;
        metadata.width = dimensions.width;
        metadata.height = dimensions.height;
        metaFiles.push(metadata);
    }

    try {
        const userDocument = await getUserBySub(user.sub);

        if (!userDocument) return { success: false, error: 'User not found' };

        for (const metaFile of metaFiles) {
            const url = (await uploadImageToS3(metaFile.fileObject)).Location;
    
            if (!url) throw new Error('Failed to upload image to S3');
    
            const savedImage = await createImage({
                _id: (new Types.ObjectId).toString(),
                url,
                width: metaFile.width,
                height: metaFile.height,
                title: metaFile?.name,
                description: 'metaFile?.description',
                tags: Array.from(metaFile?.tags),
                owner: userDocument._id,
                uploadedAt: new Date(),
                visibility: 'public',
            });
    
            await addImageToUser(user.sub, savedImage._id);
        }
    } catch(e) {
        return { success: false, error: (e as Error).message };
    }

    return { success: true }
};