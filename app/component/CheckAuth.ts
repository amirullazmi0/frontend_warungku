'use server'
import axios from "axios";
import Cookies from "js-cookie";
import { NextResponse, NextRequest } from "next/server";

async function checkAuth(request: NextRequest) {
    const API_URL = process.env.API_URL
    const access_token = Cookies.get('access_token')
    try {
        const response = await axios.get(`${API_URL}/api/auth/check-auth`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        if (!response.data.success) {
            if (request.nextUrl.pathname == ('/')) {
                return NextResponse.redirect(new URL("/login/user-account", request.url))
            } else if (request.nextUrl.pathname.startsWith('/store')) {
                return NextResponse.redirect(new URL("/login/store-account", request.url))
            }
        }
    } catch (error) {

    }
}