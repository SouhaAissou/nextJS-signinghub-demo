"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (!token) return null; // Avoid rendering until token is checked

  return (
    <div className="bg-gray-200 pt-10 w-full h-screen relative">
      <Button className="absolute top-0 right-0 m-4" onClick={handleLogout}>Logout</Button>
      <Card className="w-4/5 mx-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Where you can create a workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/workflow/adddocs")}>New Workflow</Button>
        </CardContent>
      </Card>
    </div>
  );
}
