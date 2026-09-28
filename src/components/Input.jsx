import React from 'react'

function Input({className = "", ...rest}) {
    return (
        <input className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...rest} />
    )
}

export default Input


export function Textarea({className = "", ...rest}) {
    return (
        <textarea className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...rest} />
    )
}