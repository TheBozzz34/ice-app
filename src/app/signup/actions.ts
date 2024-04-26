"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type FormData = {
  email: string;
  password: string;
};



export async function signup(formData: FormData) {
  console.log("Signing up user");

  const supabase = createClient();


  // Check if user is invited
  const { data: inviteData, error: inviteError } = await supabase
    .from('users')
    .select('*')
    .eq('email', formData.email);

  if (inviteError) {
    console.error(inviteError);
    console.log("Error checking for invite");
    //redirect("/error");
  } else {
    console.log("Invite check successful");
    return; // testing
  }
    

  // type-casting here for convenience
  // custom user metadata can be added here
  const data = {
    email: formData.email,
    password: formData.password
  };

  const { error: userError, data: userData } = await supabase.auth.signUp(data);

  if (userError) {
    console.error(userError);
    console.log("User creation failed");
    console.log(data);
    //redirect("/error");
  } else {
    console.log("User created successfully");
  }

  //revalidatePath("/newuser", "layout");
  //redirect("/newuser");
}
