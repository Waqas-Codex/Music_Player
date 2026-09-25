"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
      });

      if (!response.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("authToken", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      dispatch(setUser(response.user));

      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{
        message: string;
      }>;

      setError(
        axiosError.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Sign in to pick up where you left off.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="auth"
            icon={<Mail strokeWidth={1.75} />}
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            autoComplete="email"
          />

          <Input
            variant="auth"
            icon={<Lock strokeWidth={1.75} />}
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full rounded-2xl bg-red-500 text-white hover:bg-red-400"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-white hover:text-red-400"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}