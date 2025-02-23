"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Login() {

  // {
  //   "access_token": "string",
  //   "token_type": "string",
  //   "expires_in": 0,
  //   "refresh_token": "string"
  // }
  const grant_type = "password";
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;
  // const client_id: string = "api-1";
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET!;
  // const client_secret: string = "7C0DC06CBC0D547113BB6AB0F9BA714551EEC4270BC7131342C8B494AB1E3D58";



  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();



  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post("https://sh-api.ps.ascertia.com/authenticate", {
  //       grant_type,
  //       client_id,
  //       client_secret,
  //       username,
  //       password
  //     }, {
  //       headers: {
  //         "Accept": "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //     });

  //     console.log("Login Success:", response.data);
  //     localStorage.setItem("access_token", response.data.access_token); // Store token
  //     router.push("/dashboard"); // Redirect user after login
  //   } catch (error: any) {
  //     setError(error.response?.data?.message || "Login failed");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/authenticate`, // Use env variable
        {
          grant_type: process.env.NEXT_PUBLIC_GRANT_TYPE,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          username,
          password
        },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
          },
        }
      );
      console.log("Client ID:", process.env.NEXT_PUBLIC_CLIENT_ID);
      console.log("Client Secret:", process.env.NEXT_PUBLIC_CLIENT_SECRET);
      console.log("Grant Type:", process.env.NEXT_PUBLIC_GRANT_TYPE);
      console.log("Login Success:", response.data);
      localStorage.setItem("access_token", response.data.access_token);
      router.push("/dashboard"); // Redirect after login
    } catch (error: any) {
      console.log("Client ID:", process.env.NEXT_PUBLIC_CLIENT_ID);
      console.log("Client Secret:", process.env.NEXT_PUBLIC_CLIENT_SECRET);
      console.log("Grant Type:", process.env.NEXT_PUBLIC_GRANT_TYPE);
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };


  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }


  return (
    <div className=" items-center h-screen bg-gray-200 w-full h-screen relative">
      {/* <h2>Login</h2> */}

      {/* <form onSubmit={handleSubmit}>
        <Input
          type="username"
          name="username"
          placeholder="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <Button type="submit">Login</Button>
      </form> */}
      <Card className="w-1/3  mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label>Username</Label>
            <Input
              type="username"
              name="username"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )


}