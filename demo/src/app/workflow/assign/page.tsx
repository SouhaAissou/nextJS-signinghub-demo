"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface User {
    user_email: string;
    user_name: string;
    role: string;
    signing_order: number;
}

export default function AssignPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const searchParams = useSearchParams();
    const packageId = searchParams.get("packageId");
    const documentId = searchParams.get("documentId");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) {
            setError("Authentication required.");
            setLoading(false);
            return;
        }
        setToken(storedToken);

        if (!packageId || !documentId) {
            setError("Missing package ID or document ID.");
            setLoading(false);
            return;
        }

        const fetchDocumentImage = async () => {
            try {
                const pageNo = 1; // Displaying first page
                const resolution = "800x600";

                const response = await axios.get(
                    `${API_URL}/v4/packages/${packageId}/documents/${documentId}/images/${pageNo}/${resolution}`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                            Accept: "application/json",
                        },
                        responseType: "blob",
                    }
                );

                const imageUrl = URL.createObjectURL(response.data);
                setImageUrl(imageUrl);
            } catch (error: any) {
                console.error("Error fetching document image:", error);
                setError("Failed to load document image.");
            }
        };

        const fetchWorkflowUsers = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/v4/packages/${packageId}/workflow/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                            Accept: "application/json",
                        },
                    }
                );

                setUsers(response.data);
            } catch (error: any) {
                console.error("Error fetching workflow users:", error);
                setError("Failed to load users.");
            }
        };

        fetchDocumentImage();
        fetchWorkflowUsers();
        setLoading(false);
    }, [packageId, documentId]);

    // Function to Add Signature Field
    const addSignatureField = async () => {
        if (!token || !packageId || !documentId) {
            setError("Missing authentication or document details.");
            return;
        }

        try {
            const requestBody = {
                order: 1, // Assign to the first user in workflow
                page_no: 1, // Place on the first page
                field_name: "SignatureField",
                level_of_assurance: ["ELECTRONIC_SIGNATURE"],
                dimensions: {
                    x: 100,
                    y: 500,
                    width: 200,
                    height: 50,
                },
                display: "VISIBLE",
                authentication_signing: {
                    enabled: true,
                    otp: { enabled: true, mobile_number: "1234567890" },
                    totp: { enabled: false },
                },
            };

            const response = await axios.post(
                `${API_URL}/v4/packages/${packageId}/documents/${documentId}/fields/signature`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            alert("Signature field added successfully!");
        } catch (error: any) {
            console.error("Error adding signature field:", error);
            setError("Failed to add signature field.");
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen bg-gray-100 p-5 grid grid-cols-6 gap-4">
            {/* Document Display */}
            <Card className="col-span-4 p-5">
                <h1 className="text-2xl font-semibold mb-4">Assign Users</h1>
                {loading && <p>Loading document...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {imageUrl && (
                    <img src={imageUrl} alt="Document Preview" className="border rounded-lg shadow-lg p-5 w-full" />
                )}
                
            </Card>

            {/* Users Display */}
            <Card className="col-span-2 p-5">
                <h1 className="text-2xl font-semibold mb-4">Users</h1>
                {loading ? (
                    <p>Loading users...</p>
                ) : users.length > 0 ? (
                    <ul className="space-y-4">
                        {users.map((user, index) => (
                            <li key={index} className="p-3 border rounded-md shadow">
                                <p><strong>Name:</strong> {user.user_name}</p>
                                <p><strong>Email:</strong> {user.user_email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Order:</strong> {user.signing_order}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users assigned yet.</p>
                )}
                <Button onClick={addSignatureField} className="mt-4">
                    Add Signature Field
                </Button>
            </Card>
        </div>
    );
}
