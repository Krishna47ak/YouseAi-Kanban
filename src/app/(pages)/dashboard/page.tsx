"use client"

import { useContext } from 'react';
import { Context as DataContext } from '@/context/dataContext';

const Dashboard = () => {

    const { state: { user: { name, email, phone } }, signOut } = useContext(DataContext)

    return (
        <div className='h-[calc(100vh-5rem)] p-5 sm:p-20' >
            <p className='text-5xl font-semibold font-mono mb-10' >Profile</p>
            <div className='space-y-3' >
                <div className='flex items-center p-3 px-5 sm:text-lg bg-[#37115d] min-w-fit sm:w-96 rounded-lg' >
                    <p className='min-w-fit w-20' >Name</p>
                    <p>:</p>
                    <p className='ml-3' >{name}</p>
                </div>
                <div className='flex items-center p-3 px-5 sm:text-lg bg-[#37115d] min-w-fit sm:w-96 rounded-lg' >
                    <p className='min-w-fit w-20' >Email</p>
                    <p>:</p>
                    <p className='ml-3' >{email}</p>
                </div>
                <div className='flex items-center p-3 px-5 sm:text-lg bg-[#37115d] min-w-fit sm:w-96 rounded-lg' >
                    <p className='min-w-fit w-20' >Phone</p>
                    <p>:</p>
                    <p className='ml-3' >{phone}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard