"use client"

import Link from 'next/link'
import Image from 'next/image';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

const Navbar = () => {

    let isAuthenticated = false

    return (
        <div className="bg-gradient-to-br from-[#aa1dac] via-[#ac1d89] to-[#1e0f50] flex items-center justify-between text-white p-3 px-10 h-20" >
            <Link href="/" className="text-3xl font-bold" >
                <Image src="/kanban-icon.png" width={50} height={50} alt='logo' />
            </Link>
            <div className="flex items-center space-x-16" >
                {isAuthenticated ? (
                    <div className="relative flex items-center space-x-5 text-xl font-semibold cursor-pointer select-none" >
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger>Username</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        <Link href="/dashboard" className='flex items-center space-x-3 text-sm p-1 rounded-lg' >
                                            <Image className='min-w-5 w-5' src="/dashboard-icon.svg" width={30} height={30} alt='profile' />
                                            <p>Dashboard</p>
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>
                                        <div className='flex items-center space-x-3 text-sm p-1 text-red-600 rounded-lg' >
                                            <Image className='min-w-5 w-5' src="/signout-icon.svg" width={30} height={30} alt='profile' />
                                            <p>Sign out</p>
                                        </div>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="text-xl font-semibold hover:scale-110 duration-300 cursor-pointer select-none" >Login</Link>
                        <Link href="/signup" className="text-xl font-semibold hover:scale-110 duration-300 cursor-pointer select-none" >Signup</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar