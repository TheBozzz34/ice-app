"use client";

// PopoutMenu.tsx

import React, { useState } from 'react';
import './PopoutMenu.css'; // Import the CSS for styling
import { createClient } from '@/utils/supabase/client'

const PopoutMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const supabase = createClient()

    const [user, setUser] = useState<any | null>(null) // TODO - find type definition

    const [showUser, setShowUser] = useState<boolean>(false)

    async function getUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            console.error(error)
            return
        }
        setUser(data)
    }

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
        setShowUser(!showUser)
    };

    return (
        <>
            <div className="popout-container">
                <button className="popout-button" onClick={toggleMenu}>
                    Developer Menu
                </button>
                {isOpen && (
                    <>
                        <div className="popout-menu">
                            <a href="/logout" className="menu-item">Logout</a>
                            <a href="/login" className="menu-item">Login</a>
                            <a href="/frankocean" className="menu-item">Debug Menu</a>
                            <a href="/error" className="menu-item">Error Page</a>
                            <a href="/client" className="menu-item">Client Page</a>
                            <a href="/admin" className="menu-item">Admin Page</a>
                            <button onClick={getUser} className="menu-item">Get User</button>
                        </div>
                    </>


                )}
            </div>

            {user && (
                <pre>{JSON.stringify(user, null, 2)}</pre>
            )}
        </>
    );
};

export default PopoutMenu;