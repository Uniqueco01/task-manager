import React from 'react'

function Button({children, className = "", variant = "primary", ...rest}) {

    const baseClasses = "font-semibold cursor-pointer py-1 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105";
    const variantClasses = {
        primary: "bg-blue-500 hover:bg-blue-700 text-white",
        secondary: "bg-gray-500 hover:bg-gray-700 text-white",
        success: "bg-green-500 hover:bg-green-700 text-white",
        danger: "bg-red-500 hover:bg-red-700 text-white",
        outline: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
        outlineprimary: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
        outlinedanger: "bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    }

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
            {children}
        </button>
    )
}

export default Button
