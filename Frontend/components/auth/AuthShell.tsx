"use client";

import { BrandLogo } from "@/components/BrandLogo";

type AuthMode = "login" | "register";

type AuthShellProps = {
  mode: AuthMode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <BrandLogo compact />

        <h1 className="mt-6 text-3xl font-bold text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm text-zinc-400">
            {subtitle}
          </p>
        )}

        <div className="mt-8 space-y-5">
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {footer}
        </div>
      </div>
    </div>
  );
}