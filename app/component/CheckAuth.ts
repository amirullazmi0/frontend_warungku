'use server'
import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

export async function checkAuth(request: NextRequest) {
    const API_URL = process.env.API_URL; // Ensure this is properly set in your .env file
    const access_token = request.cookies.get('accessToken'); // Use request.cookies in Next.js server-side functions

    if (!access_token) {
        return redirectToLogin(request);
    }

    try {
        const response = await axios.get(`${API_URL}/auth/check-auth`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        console.log('+', response.data);

        if (!response.data.success) {
            return handleAuthFailure(request);
        }

        // Optionally, return a successful response if needed
        return NextResponse.next();
    } catch (error) {

        return redirectToLogin(request);
    }
}

function handleAuthFailure(request: NextRequest) {
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login/user-account', request.url));
    }
    return NextResponse.next(); // Default to proceeding
}

function redirectToLogin(request: NextRequest) {
    // You could redirect to a default login page or the one relevant for the user
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login/user-account', request.url)); // This is correct

    } else if (request.nextUrl.pathname.startsWith('/store')) {
        return NextResponse.redirect(new URL('/login/store-account', request.url));
    }
    return NextResponse.next(); // Proceed to next step if needed
}
