"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface User {
    user_email: string;
    user_name: string;
    role: string;
    signing_order: number;
    delivery_method: string;
}

export default function AddUsers() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const router = useRouter();
    const searchParams = useSearchParams();
    const packageId = searchParams.get("packageId");
    const documentId = searchParams.get("documentId");
    const [token, setToken] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([
        { user_email: "", user_name: "", role: "SIGNER", signing_order: 1, delivery_method: "EMAIL" },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) {
            router.push("/login");
        } else {
            setToken(storedToken);
        }

        if (!packageId) {
            alert("No package ID found. Redirecting...");
            router.push("/workflow/adddocs");
        }
    }, [router, packageId]);

    // Handle input change
    const handleInputChange = (index: number, field: keyof User, value: any) => {
        const updatedUsers = [...users];
        (updatedUsers[index][field] as any) = value;
        setUsers(updatedUsers);
    };

    // Add a new user entry
    const addUser = () => {
        setUsers([...users, { user_email: "", user_name: "", role: "SIGNER", signing_order: users.length + 1, delivery_method: "EMAIL" }]);
    };

    // Remove a user entry
    const removeUser = (index: number) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    // Submit all users
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !packageId) {
            alert("Missing authentication or package ID!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_URL}/v4/packages/${packageId}/workflow/users`,
                users,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Users Added to Workflow:", response.data);
            alert("Users successfully added!");
            router.push(`/workflow/assign?packageId=${packageId}&documentId=${documentId}`); // Redirect after success
        } catch (error: any) {
            console.error("Error adding users:", error);
            setError(error.response?.data?.message || "Failed to add users.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center bg-gray-200 pt-10 w-full h-screen">
            <Card className="w-3/4">
                <CardHeader>
                    <CardTitle>Add Users to Workflow</CardTitle>
                    <CardDescription>Assign multiple users to sign or review the document.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {users.map((user, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-2 relative">
                            <Label>Email</Label>
                            <Input type="email" value={user.user_email} onChange={(e) => handleInputChange(index, "user_email", e.target.value)} required />

                            <Label>Name</Label>
                            <Input type="text" value={user.user_name} onChange={(e) => handleInputChange(index, "user_name", e.target.value)} required />

                            <Label>Role</Label>
                            <Select value={user.role} onValueChange={(value) => handleInputChange(index, "role", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SIGNER">Signer</SelectItem>
                                    <SelectItem value="REVIEWER">Reviewer</SelectItem>
                                    <SelectItem value="EDITOR">Editor</SelectItem>
                                    <SelectItem value="CARBON_COPY">Carbon Copy</SelectItem>
                                </SelectContent>
                            </Select>

                            <Label>Signing Order</Label>
                            <Input type="number" value={user.signing_order} onChange={(e) => handleInputChange(index, "signing_order", Number(e.target.value))} />

                            <Label>Delivery Method</Label>
                            <Select value={user.delivery_method} onValueChange={(value) => handleInputChange(index, "delivery_method", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMAIL">Email</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="EMAIL_AND_SMS">Email & SMS</SelectItem>
                                </SelectContent>
                            </Select>

                            {users.length > 1 && (
                                <Button variant="destructive" onClick={() => removeUser(index)} className="absolute top-2 right-2">
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button onClick={addUser} className="mt-4 w-full">
                        Add Another User
                    </Button>

                    {error && <p className="text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} size="lg" disabled={loading}>
                        {loading ? "Adding Users..." : "Submit Users"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
