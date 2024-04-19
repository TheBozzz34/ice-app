import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import gravatar from 'gravatar'
import Image from 'next/image'

const ROLE_THRESHOLD = 65535;


function prettyDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default async function SuperAdminPage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    } 
    
    let { data: userRoles, error: userRolesError } = await supabase
    .from('users')
    .select('*')
    .eq('user', data.user.id)

    function handleError(error: any) {
        console.error(error);
        handleRedirection();
    }
    
    function handleRedirection() {
        redirect('/login');
    }
    
    function handleUserRoles(userRoles: any[]) {
        if (userRoles.length > 0) {
            const userRoleInt4 = userRoles[0].role;
            if (typeof userRoleInt4 === 'number' && userRoleInt4 < ROLE_THRESHOLD) {
                handleRedirection();
            }
        } else {
            handleRedirection();
        }
    }
    
    function processUserRoles(userRolesError: any, userRoles: any[]) {
        if (userRolesError) {
            handleError(userRolesError);
        } else {
            handleUserRoles(userRoles);
        }
    }
    

    processUserRoles(userRolesError, userRoles || []);




    return (
        <>
            <h1>Private Page</h1>

{/*
            <div id="users">
                {users.map((user: any) => (
                    <div key={user.id} className="user">
                        <h2 className="title">
                            {user.email}
                        </h2>

                        <Image
                            src={gravatar.url(user.email, { protocol: 'https', s: '100' })}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="avatar"
                            priority
                        />

                        <table className="info">
                            <tbody>
                                <tr>
                                    <td>Role:</td>
                                    <td>{user.role}</td>
                                </tr>
                                <tr>
                                    <td>Created:</td>
                                    <td>{prettyDate(user.created_at)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            */}


        
        </>
    )
}