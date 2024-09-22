"use client"
import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaRegCopy } from "react-icons/fa6";

const UserSettings = () => {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uuid, setUuid] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [permissionValue, setPermissionValue] = useState<number>(0);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError) {
                console.error('Error fetching user:', authError.message);
                setLoading(false);
                return;
            }

            if (authData?.user) {
                setUser(authData.user);
                setUuid(authData.user.id || '');
                setEmail(authData.user.email || '');


                let { data: users, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', authData.user.email);

                if (error) {
                    console.error('Error fetching user:', error.message);
                    setLoading(false);
                    return;
                } else {
                    if (users && users.length > 0) {
                        setName(users[0].name);
                        setPermissionValue(users[0].role);
                    }
                }
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const updateUserSettings = async () => {
        try {
            setLoading(true);

            const { error } = await supabase.auth.updateUser({
                email,
            });
            if (error) throw error;

            // Then update the name in your custom `users` table
            const { error: userError } = await supabase
                .from('users')
                .update({ name })
                .eq('email', user.email);  // Match based on the user's original email (before any update)

            if (userError) {
                throw new Error(userError.message);
            }

            alert('Profile updated!');
        } catch (error) {
            alert('Error updating profile!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div id="nav" className="bg-white shadow-md py-4 px-8">
                <nav className="flex justify-between items-center mx-auto">
                    <div className="flex items-center space-x-6">
                        <a href="/client" className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                            Home
                        </a>
                        <a href="/settings" className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                            Settings
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-700 font-semibold hover:text-blue-600">
                            thing 1
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            thing 2
                        </button>
                    </div>
                </nav>
            </div>

            <div className="max-w-lg mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">User Settings</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <span>UUID</span>
                            <span className="block text-lg font-bold p-2 border border-2 border-gray-300 rounded-md hover:cursor-not-allowed">{uuid} <FaRegCopy className="float-end cursor-pointer hover:text-blue-500" onClick={() => navigator.clipboard.writeText(uuid)} /></span>
                        </div>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-2 border-gray-300"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-2 border-gray-300"
                            />
                        </div>
                        <div>
                            <span>Role</span>
                            <span className="block text-lg font-bold p-2 border border-2 border-gray-300 rounded-md hover:cursor-not-allowed">{permissionValue}</span>
                        </div>
                        <Button onClick={updateUserSettings} disabled={loading}>
                            {loading ? 'Updating...' : 'Update Settings'}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserSettings;