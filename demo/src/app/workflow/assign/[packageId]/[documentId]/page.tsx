"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentDetails() {
  const { packageId, documentId } = useParams(); // Extract packageId & documentId from URL
  const router = useRouter();
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.signinghub.com/v4/packages/${packageId}/documents/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setDocument(response.data);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document details.");
      }
    };

    fetchDocumentDetails();
  }, [packageId, documentId, router, token]);

  if (!token) return null;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!document) return <div>Loading document details...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button onClick={() => router.push("/dashboard")} className="mb-4">
        Back to Dashboard
      </Button>

      <Card className="w-3/4 mx-auto">
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
          <CardDescription>Document ID: {documentId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Document Name:</strong> {document.document_name}</p>
          <p><strong>Created On:</strong> {document.created_on}</p>
          <p><strong>Pages:</strong> {document.document_pages}</p>
          <p><strong>Type:</strong> {document.document_type}</p>
        </CardContent>
      </Card>
    </div>
  );
}
