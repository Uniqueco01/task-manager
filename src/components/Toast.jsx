import React, { useEffect, useState } from 'react'

function Toast({ message }) {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (message && message.text) {
            setShowToast(true);
        }
        const timeoutId = setTimeout(() => {
            setShowToast(false);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [message]);

    const variantClasses = {
        success: "bg-green-100 text-green-800",
        error: "bg-red-100 text-red-800",
        warning: "bg-yellow-100 text-yellow-800",
        info: "bg-blue-100 text-blue-800",
    }

    const variantIcons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    }
    return (
        showToast && (
            <ul className="fixed w-xs right-0 top-0 p-6 flex flex-col gap-4 justify-end z-1000">
                <li className={`p-4 rounded shadow-md flex items-center gap-2 ${variantClasses[message.type]}`}>
                    <span>{variantIcons[message.type]}</span>
                    <span className="ml-2">{message.text}</span>
                </li>
        </ul>
        )
    )
}

export default Toast
