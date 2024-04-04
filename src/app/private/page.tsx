import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import SignOutButton from '@/components/SignOut/SignOut.component'

import gravatar from 'gravatar'

import Image from 'next/image'

function prettyDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default async function PrivatePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    let metadata = data.user.user_metadata

    return (
        <>
            <h1>Private Page</h1>
            <div className="profile">
                <h2 className="title">
                    {metadata.first_name} {metadata.last_name}
                </h2>

                <Image
                    src={gravatar.url(data.user.email!, {protocol: 'https', s: '100'})}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="avatar"
                    priority
                />

                <table className="info">
                    <tbody>
                        
                        {data.user.phone && (
                            <tr>
                            <td>Cell:</td>
                            <td>{data.user.phone}</td>
                        </tr>
                        )}

                        <tr>
                            <td>Email:</td>
                            <td>{data.user.email}</td>
                        </tr>
                        <tr>
                            <td>Registered:</td>
                            <td>{prettyDate(data.user.created_at)}</td>
                        </tr>
                        <tr>
                            <td>Id:</td>
                            <td>{data.user.id}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*<SignOutButton />*/}
        </>
    )
}