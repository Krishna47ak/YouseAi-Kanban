import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' || path === '/'

    const isAdminPath = path === '/onboarding' || path === '/myboard'

    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/onboarding', request.nextUrl))
    }

    if (isAdminPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/onboarding',
        '/myboard'
    ]
}