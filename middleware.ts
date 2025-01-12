'use server'
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import { checkAuth } from "./app/component/CheckAuth";

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
    } else {
        try {
            // const response = await axios.get(`${API_URL}/auth/check-auth`, {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // })


            // console.log(response.data);

            // if (!response.data) {
            //     request.cookies.delete('accessToken')
            // }
            await checkAuth(request)

        } catch (error) {
            request.cookies.delete('accessToken')
        }
    }

}

export const config = {
    matcher: ["/:path*", "/store/:path*"],
}