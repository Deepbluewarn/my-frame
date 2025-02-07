import { IUserInfo } from "@/db/models/User";
import { getImageStarList } from "@/services/Image";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    let res: IUserInfo[] = [];

    if (!imageId) {
        return res
    }

    res = await getImageStarList(imageId);
    return Response.json(res);
}
