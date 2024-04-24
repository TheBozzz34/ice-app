'use server'
 
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
 
export async function navigate(path: string) {
  redirect(`/${path}`)
}

export async function revalidatePathFunc(path: string, layout: any) { // bruh more any
    revalidatePath(`/${path}`, layout)
}
    