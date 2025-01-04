import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { CustomMiddleware } from "./chain";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function withAuth0Middleware(middleware: CustomMiddleware): CustomMiddleware {
    return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
        withMiddlewareAuthRequired();
        return middleware(request, event, response);
    };
}
