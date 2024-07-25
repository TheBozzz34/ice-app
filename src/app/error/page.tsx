'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'


function Search() {
  const searchParams = useSearchParams()
  const message = searchParams.get('__message')

  return <p className="mt-4 text-gray-800 mb-4">{message ? atob(message) : ''}</p>
}


export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">An error occurred!</h1>
        <p className="mt-2 text-gray-600">A detailed description of the error is below:</p>
        <Suspense fallback={<p className="mt-4 text-gray-800">Loading...</p>}>
          <Search />
        </Suspense>
        <a className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none" href="/login">
          Go to login
        </a>
      </div>
    </div>
  )
}
