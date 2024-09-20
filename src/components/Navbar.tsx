"use client"

import { useContext } from 'react';
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
import { Context as DataContext } from '@/context/dataContext';


const Navbar = () => {

    const { state: { isAuthenticated, user: { name } }, signOut } = useContext(DataContext)

    return (
        <div className="bg-[#1e0f50] flex items-center justify-between text-white p-3 px-10 h-20" >
            <Link href="/" className="flex items-center space-x-3 text-3xl font-bold" >
                <Image src="/kanban-logo.png" width={50} height={50} alt='logo' />
                <p className='hidden sm:block' >TaskFlow</p>
            </Link>
            <div className="flex items-center space-x-5 sm:space-x-16" >
                {isAuthenticated ? (
                    <div className="relative flex items-center space-x-5 text-xl font-semibold cursor-pointer select-none" >
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger>{name}</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        <Link href="/myboard" className='flex items-center space-x-3 text-sm p-1 rounded-lg' >
                                            <Image className='min-w-5 w-5' src="/kanban-icon.svg" width={30} height={30} alt='profile' />
                                            <p>My Board</p>
                                        </Link>
                                    </MenubarItem>
                                    <MenubarItem>
                                        <Link href="/dashboard" className='flex items-center space-x-3 text-sm p-1 rounded-lg' >
                                            <Image className='min-w-5 w-5' src="/dashboard-icon.svg" width={30} height={30} alt='profile' />
                                            <p>Dashboard</p>
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem onClick={() => signOut()} >
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
                        <Link href="/login" className="text-lg sm:text-xl font-semibold hover:scale-110 duration-300 cursor-pointer select-none" >Login</Link>
                        <Link href="/signup" className="text-lg sm:text-xl font-semibold hover:scale-110 duration-300 cursor-pointer select-none" >Signup</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar