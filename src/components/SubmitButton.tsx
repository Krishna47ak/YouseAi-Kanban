import React from 'react'

const SubmitButton = ({ name, loading }: { name: string; loading: boolean }) => {
    return (
        <div className='flex justify-center mt-10' >
            <button disabled={loading} type='submit' className={`bg-blue-600 w-full py-3 rounded-xl font-medium hover:scale-105 duration-300 ${loading ? 'opacity-50 cursor-progress' : ''}`} >{loading ? 'Loading...' : name}</button>
        </div>
    )
}

export default SubmitButton