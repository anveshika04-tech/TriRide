import React from 'react'

const LookingForDriver = () => {
    return (
        <div className="p-6">
            <div className="flex justify-center mb-6">
                <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>
            
            <h3 className='text-2xl font-semibold mb-8 text-center'>Looking for a Driver</h3>

            <div className='flex justify-center'>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
            
            <p className="text-center text-gray-600 mt-6">
                Please wait while we connect you with a driver...
            </p>
        </div>
    )
}

export default LookingForDriver