import React from 'react'
import Button from './Button'

function ConfirmDeleteModal({onClose, onConfirm}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">
                    Confirmation
                </h2>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this task? once deleted, it cannot be recovered.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outlinedanger" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="outlineprimary" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal
