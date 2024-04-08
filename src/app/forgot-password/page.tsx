"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import bg from '../../../public/Wheeler-Peak.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
    const [formData, setFormData] = useState({
        email: ''
    });

    const [buttonMessage, setButtonMessage] = useState('Send Reset Email')

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setButtonMessage('Sending email...');

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        // await forgotPassword(formDataToSend); // This function doesn't exist yet, check out https://supabase.com/docs/guides/auth/passwords#example-request-a-password-reset-email
        setButtonMessage('Email sent! Redirecting...');

        
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <form className="mx-auto grid w-[350px] gap-6 bg-white p-4 rounded-lg" onSubmit={handleSubmit}>
                    <div className="grid gap-2 text-center bg-white">
                        <h1 className="text-3xl font-bold">Forgot Password</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to reset your password
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="joe@email.net"
                                required
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {buttonMessage}
                        </Button>
                    </div>
                </form>
            </div>
            <div className="hidden lg:flex items-center justify-center">
                <Image
                    src={bg}
                    alt="Background"
                    className="object-cover w-full h-screen fixed z-[-1] top-0 left-0"
                />
            </div>
        </div>
    );
}