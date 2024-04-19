"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type FormData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};



export async function signup(formData: FormData) {
  /* No second password field in the form right now
  if (formData.get("password") !== formData.get("repeat-password")) {
    alert("Passwords do not match!");
    return;
  }
  */

  const supabase = createClient();

  // type-casting here for convenience
  // custom user metadata can be added here
  const data = {
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
    },
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
