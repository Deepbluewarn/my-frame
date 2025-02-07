import { IComment } from "@/db/models/Image";
import { getImageComments } from "@/services/Image";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    let res: IComment[] = [];

    if (!imageId) {
        return res;
    }
    res = await getImageComments(imageId);

    return Response.json(res);
}
