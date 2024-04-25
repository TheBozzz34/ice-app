import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

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