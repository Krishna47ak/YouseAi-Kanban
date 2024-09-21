import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' || path === '/'

    const isAdminPath = path === '/onboarding' || path === '/myboard' || path === '/dashboard'

    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    if (isAdminPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/onboarding',
        '/myboard',
        '/dashboard',
    ]
}