'use server'
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let accessToken = request.cookies.get('accessToken')
    const API_URL = process.env.API_URL
    if (!accessToken) {
        request.cookies.delete('accessToken')
        if (request.nextUrl.pathname == ('/')) {
            return NextResponse.redirect(new URL("/login/user-account", request.url))
        } else if (request.nextUrl.pathname.startsWith('/store')) {
            return NextResponse.redirect(new URL("/login/store-account", request.url))
        }
    }

    try {
        const response = await axios.get(`${API_URL}/api/auth/check-auth`, {
            headers: {
                Authorization: `Bearer ${accessToken?.value}`
            }
        })

        if (response.data.data.user.rolesName === 'user' && request.nextUrl.pathname.startsWith('/super')) {
            return NextResponse.redirect(new URL("/", request.url))
        } else if (response.data.data.user.rolesName === 'super' && request.nextUrl.pathname.startsWith('/supermen')) {
            return NextResponse.redirect(new URL("/super", request.url))
        }

        if (!response.data) {
            request.cookies.delete('accessToken')
        }

    } catch (error) {
        request.cookies.delete('accessToken')
    }
}

export const config = {
    matcher: ["/:path*", "/store/:path*"],
}