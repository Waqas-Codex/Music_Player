"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "auth";
}

export function Input({
  label,
  error,
  icon,
  variant = "default",
  className = "",
  ...props
}: InputProps) {
  const isAuth = variant === "auth";

  const baseStyles = "w-full rounded-xl text-white placeholder:text-zinc-500 outline-none transition focus:ring-2";

  const authStyles = `
    h-12
    border
    border-zinc-700
    bg-zinc-950
    px-4
    text-sm
    focus:border-red-500
    focus:ring-red-500/20
    ${icon ? "pl-11" : ""}
  `;

  const defaultStyles = `
    h-10
    border
    border-gray-600
    bg-gray-800
    px-3
    text-sm
    focus:border-red-500
    focus:ring-red-500/20
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${isAuth ? "text-zinc-300" : "text-gray-300"}`}>
          {label}
        </label>
      )}

      <div className={icon ? "relative" : ""}>
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </span>
        )}

        <input
          className={`${baseStyles} ${isAuth ? authStyles : defaultStyles} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}