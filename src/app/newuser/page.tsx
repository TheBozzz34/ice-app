import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function NewUser() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }


    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user", data.user.id);

    if (userError || !userData || userData.length === 0) {
        console.error(userError);
        redirect("/error");
    } else {
        if (userData.length > 0) {
            redirect("/client");
        } else {
            const { data: userData, error: userError } = await supabase
            .from("users")
            .insert([{ user: data.user.id, role: 0 }])
            .select();
        }
    }
}