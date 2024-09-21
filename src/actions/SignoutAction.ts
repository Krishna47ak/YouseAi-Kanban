"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const onSignOut = () => {
    const cookieStore = cookies()
    cookieStore.delete('token')    
    redirect("/")
}