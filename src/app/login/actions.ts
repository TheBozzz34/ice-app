// 'use server'

import { createClient } from '@/utils/supabase/client'
import { navigate, revalidatePathFunc } from './redirect'

export async function login(formData: FormData) {

  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    navigate('error')
    return
  }

  revalidatePathFunc('/', 'layout')
  navigate('private')
}
