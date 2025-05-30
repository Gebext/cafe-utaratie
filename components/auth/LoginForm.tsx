"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/authSlice";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login gagal. Cek kredensial Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#c9d6df] bg-white shadow-md">
      <CardHeader>
        <CardTitle
          className="text-xl text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Crew Login
        </CardTitle>
        <CardDescription>
          Enter your credentials to access the crew portal
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="border-[#c9d6df] focus-visible:ring-[#1e6091]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="border-[#c9d6df] pr-10 focus-visible:ring-[#1e6091]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Button
            type="submit"
            className="w-full bg-[#1e6091] text-white hover:bg-[#154c74]"
            disabled={isLoading}
            style={{ fontFamily: "Pirata One, cursive" }}
          >
            {isLoading ? "Setting Sail..." : "All Aboard!"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
