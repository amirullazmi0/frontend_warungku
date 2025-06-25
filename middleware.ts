'use server'
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import { checkAuth } from "./app/component/CheckAuth";

export async function middleware(request: NextRequest) {
    let accessToken = request.cookies.get('accessToken')
    const API_URL = process.env.API_URL

    if (!accessToken) {
        request.cookies.delete('accessToken')

        // If user does not have accessToken and tries to visit '/', redirect to '/guest'
        if (request.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL("/guest", request.url))
        }
    } else {
        try {
            await checkAuth(request)

            // If user is authenticated and tries to visit '/guest', redirect to '/'
            if (request.nextUrl.pathname === '/guest') {
                return NextResponse.redirect(new URL("/", request.url))
            }

        } catch (error) {
            request.cookies.delete('accessToken')
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*", "/store/:path*"],
}
