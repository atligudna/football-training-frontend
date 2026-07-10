"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
    const router = useRouter();
    const { login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setError("");

        try {
            await login({
                email,
                password,
            });

            router.push("/dashboard");
        } catch {
            setError("Rangt netfang eða lykilorð.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-sm flex-col gap-4"
        >
            <h1 className="text-3xl font-bold text-center">
                Football Planner
            </h1>

            <Input
                type="email"
                placeholder="Netfang"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Lykilorð"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Skrái inn..." : "Skrá inn"}
            </Button>
        </form>
    );
}