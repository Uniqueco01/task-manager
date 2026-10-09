import React from 'react'

function Home() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-2 bg-sky-100">
            <h1 className="text-3xl font-bold">Welcome to <span className=' text-blue-600'>Uniqueco</span> Task Manager</h1>
            <p className='text-gray-600'>Plan your work. Finish your tasks.</p>
        </div>
    );
}

export default Home