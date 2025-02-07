import { actionGetUserIdBySub } from "@/actions/user";
import { getNextImagesById, getPrevImagesById, ImageWithOwner } from "@/services/Image";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const boundaryImageId = searchParams.get('boundaryImageId')
    const limit = parseInt(searchParams.get('limit') || '4');
    const imageOwnerId = searchParams.get('imageOwnerId')
    const direction = searchParams.get('direction')
    let res: ImageWithOwner[] = [];
    const userId = await actionGetUserIdBySub();

    if (!boundaryImageId || ! userId || !imageOwnerId) {
        return Response.json(res);
    }

    if (direction === 'prev') {
        res = await getPrevImagesById({ _id: boundaryImageId, viewerId: userId, ownerId: imageOwnerId, limit });
    } else if (direction === 'next') {
        res = await getNextImagesById({ _id: boundaryImageId, viewerId: userId, ownerId: imageOwnerId, limit });
    }

    return Response.json(res)
}
