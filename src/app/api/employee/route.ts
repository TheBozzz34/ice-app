import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
    const supabase = createClient();

    const jwt = request.headers.get('Authorization')?.replace('Bearer ', '') // need to use jwt

    if (!jwt) {
        return new Response('Unauthorized', {
            status: 401,
        })
    }

    const email = request.headers.get('email')


    const { data: { user } } = await supabase.auth.getUser(jwt)

    if (!user || user === null) {
        return new Response('Unauthorized', {
            status: 401,
        })
    }

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq('email', email)

    if (error) {
        console.error(error)
        return new Response('Failed to get users', {
            status: 500,
        })
    } else {
        return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }
}