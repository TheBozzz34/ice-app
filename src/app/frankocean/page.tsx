import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


function prettyDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default async function SuperAdmiPPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    let isgood = false
    if (data.user.email == 'ejames25@sfprep.org') {
        isgood = true
    }
    async function bypassCheck() {
        if (!searchParams['bypass']) {
            return
        }

        if (isgood) {
            return
        }

        let { data: beacon, error } = await supabase
            .from('beacon')
            .select('*')
            .eq('access_token', searchParams['bypass'])

        if (error) {
            console.error(error)
            return
        }

        if (beacon) {
            isgood = true
            console.log(beacon)
        }
    }
    if (searchParams['bypass']) {
        await bypassCheck()
    }

    const env = process.env.NODE_ENV
    const tz = process.env.TZ

    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL



    return (
        <>
            {isgood ? (
                <>
                    <p>1. {data.user.email}</p>
                    <p>2. {data.user.role}</p>
                    <p>3. {prettyDate(data.user.created_at)}</p>
                    <p>4. {data.user.id}</p>
                    <p>5. {data.user.aud}</p>
                    <p>6. {data.user.confirmed_at}</p>
                    <p>7. {supabase.realtime.apiKey}</p>
                    <p>8. {supabase.realtime.endPoint}</p>
                    <p>9. {env}</p>
                    <p>10. {tz}</p>
                    <p>11. {supabaseKey}</p>
                    <p>12. {supabaseUrl}</p>
                    <p>13. {searchParams['bypass']}</p>
                </>
            ) : (
                <span className='text-red-500 text-2xl'>
                    You cannot access this page.
                </span>
            )}



        </>
    )
}