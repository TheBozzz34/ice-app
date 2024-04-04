import { createClient } from '@/utils/supabase/client'

export default async function logout() {
  const supabase = createClient()


  const { error } = await supabase.auth.signOut()

  if (error) {
    <>
      <span className="text-white">Error logging out</span>
    </>
    return
  } else {
    return (
      <>
        <span className="text-white">You have been logged out</span>
      </>
    )
  }
}