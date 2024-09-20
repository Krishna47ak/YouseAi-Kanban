"use client"

import { useContext, useEffect } from "react"
import Navbar from "@/components/Navbar"
import { Context as DataContext } from "@/context/dataContext";
import FadeLoader from "react-spinners/FadeLoader";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { state: { isAuthenticated, loading }, fetchUser } = useContext(DataContext)

    useEffect(() => {
        if (!isAuthenticated) {
            fetchUser()
        }
    }, [isAuthenticated, fetchUser])



    return (
        <div className="bg-gradient-to-bl from-[#1e0f50] via-[#9e1dacb2] to-[#1e0f50]" >
            <Navbar />
            {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]" >
                    <FadeLoader color="#fff" height={20} width={7} margin={10} />
                </div>
            ) : children}
        </div>
    )
}
