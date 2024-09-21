"use server"
import { cookies } from 'next/headers'

export const onSignOut = () => {
    const cookieStore = cookies()
    cookieStore.delete('token')
}