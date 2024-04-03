import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function SignOutButton() {
    const supabase = createClient()


    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            redirect('/')
        } else {
            redirect('/error')
        }
    }

    return (
        <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Sign Out
        </button>
    )

}