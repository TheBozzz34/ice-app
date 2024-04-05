"use client"

import { useState } from 'react';
import { login } from './actions';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import grad from "../../../public/grad.png"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [ buttonMessage, setButtonMessage ] = useState('Login')

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setButtonMessage('Logging in...');


    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    await login(formDataToSend);
    setButtonMessage('Login Successful! Redirecting...');
  };

  return (
    <>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2 text-center">
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
            <Button variant="outline" className="w-full" onClick={() => alert('Google Login')}>
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden lg:block border-l">
        <Image
          src="/placeholder.png"
          alt="Image"
          height={1920}
          width={1080}
          className="h-full w-full object-fit dark:brightness-[0.2] dark:grayscale hidden"
        />
      </div>
    </div>
    </>
  );
}
