"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddDocs() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);


  const router = useRouter();
  const packageId = "40631"; // Constant package ID for now

  useEffect(() => {
    // Ensure this only runs on the client
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (!token) {
      alert("You are not authenticated!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_URL}/v4/packages/${packageId}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/octet-stream",
            "x-file-name": file.name,
            "x-convert-document": "true",
            "x-source": "API",
          },
        }
      );
    
      console.log("API Response:", response.data);
      alert("Document uploaded successfully!");
      
      // Redirect with correct query parameters
      router.push(`/workflow/add-users?packageId=${packageId}&documentId=${response.data.documentid}`);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 pt-10 w-full h-screen relative">
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>New Workflow</CardTitle>
          <CardDescription>Add document</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
            <span className="text-xs text-gray-500">PDF, image, video, or audio</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="application/pdf" onChange={handleFileChange} />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} size="lg" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
