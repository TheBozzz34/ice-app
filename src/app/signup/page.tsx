"use client";

import { signup } from "./actions";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const supabase = createClient();
  const [isUserValid, setIsUserValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function startSignup() {
    console.log("Starting signup");
    const { data: inviteData, error: inviteError } = await supabase
      .from("users")
      .select("*")
      .eq("email", formData.email);

    if (inviteError) {
      setShowError(true);
      setErrorMessage("Error checking for invite: " + inviteError.message);
      setIsUserValid(false);
      // redirect("/error");
    } else {
      console.log(inviteData);
      //setIsUserValid(!!inviteData && inviteData.length > 0);

      if (!!inviteData && inviteData.length > 0) {

        const data = {
          email: formData.email,
          password: formData.password,
        };

        const { error: userError, data: userData } = await supabase.auth.signUp(
          data
        );

        if (userError) {
          setShowError(true);
          setErrorMessage(userError.message);
        } else {
          console.log("User created successfully");
          setShowError(false);
          setShowSuccess(true);
          setSuccessMessage("User created successfully");
          setFormData({
            email: "",
            password: "",
          });
        }
      } else {
        setShowError(true);
        setErrorMessage("Invalid email");
      }
    }
  }

  return (
    <div className="grid gap-4 w-full max-w-md mx-auto p-4">
      <div className="grid gap-4 my-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <Button className="w-full" onClick={() => startSignup()}>
          Sign Up
        </Button>
      </div>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>

      {showError && (
        <Card className="bg-red-100 text-red-700">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{errorMessage}</CardDescription>
          </CardContent>
        </Card>
      )}

      {showSuccess && (
        <Card className="bg-green-100 text-green-700">
          <CardHeader>
            <CardTitle>Success</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{successMessage}</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
