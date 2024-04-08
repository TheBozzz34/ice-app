"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("floating_phone") as string,
    options: {
      data: {
        first_name: formData.get("first-name") as string,
        last_name: formData.get("last-name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
