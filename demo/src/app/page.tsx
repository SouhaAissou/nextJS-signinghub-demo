"use client"
import { redirect } from "next/dist/server/api-utils";
import router, { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
     
    const router = useRouter();
    useEffect(() => {
        handleRedirect();
    }, []);

    const handleRedirect = () => {
        router.push("/login");
    }

    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    )

    }