'use client'

import { useEffect } from 'react'
import logout from './actions'
import { LogOut } from 'lucide-react'

export default function LogoutPage() {
  useEffect(() => {
    logout()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <LogOut className="h-12 w-12 text-blue-600 mx-auto" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">You have been logged out</h1>
        <p className="mt-2 text-gray-600 mb-4">We hope to see you again soon!</p>
        <a className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none" href="/login">
          Login Again
        </a>
      </div>
    </div>
  )
}
