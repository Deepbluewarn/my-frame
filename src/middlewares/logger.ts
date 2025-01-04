import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";
import { logger } from '@/utils/logger';

export function withLoggerMiddleware(middleware: CustomMiddleware): CustomMiddleware {
    return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
        const logData = {
            url: request.nextUrl.href,
            method: request.method,
            query: Object.fromEntries(request.nextUrl.searchParams.entries()),
            ip: request.headers.get('cf-connecting-ip') || request.ip,
        };
        logger.info('[Middleware request]', logData);
        return middleware(request, event, response);
    };
}