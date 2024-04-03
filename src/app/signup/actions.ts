"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {


  if (formData.get("floating_password") !== formData.get("floating_repeat_password")) {
    alert("Passwords do not match!");
    return;
  }

  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("floating_email") as string,
    password: formData.get("floating_password") as string,
    phone: formData.get("floating_phone") as string,
    options: {
      data: {
        first_name: formData.get("floating_first_name") as string,
        last_name: formData.get("floating_last_name") as string,
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
