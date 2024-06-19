"use client";

import { useState } from "react";
import { login } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../../public/Logo-Draft.png";
import bg from "../../../public/Wheeler-Peak.jpg";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [buttonMessage, setButtonMessage] = useState("Login");

  const handleChange = (e: any) => {
    // eknewfnofeife i hate any
    if (e.target === null) {
      return;
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    // eknewfnofeife i still hate any
    e.preventDefault();
    setButtonMessage("Logging in...");

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    await login(formDataToSend);
    setButtonMessage("Login Successful! Redirecting...");
  };

  return (
    <>
      <Image
        src={bg}
        alt="Background"
        className="object-cover w-full h-screen fixed z-[-1] top-0 left-0"
      />

      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
          <form
            className="mx-auto grid w-[350px] gap-6 bg-white p-4 rounded-lg"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2 text-center bg-white">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              <Button type="submit" className="w-full">
                {buttonMessage}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
