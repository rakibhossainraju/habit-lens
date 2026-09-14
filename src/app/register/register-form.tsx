"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/google-icon";
import { loginWithGoogle } from "@/app/login/actions";
import { registerUser } from "./actions";

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(undefined, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (signInResult?.error) {
      window.location.href = "/login";
      return;
    }

    // A full reload (rather than client-side routing) so the session
    // provider picks up the freshly created session on first render.
    window.location.href = "/dashboard";
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="name">
            Name
          </label>
          <Input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="text-[10px] text-muted-foreground mt-1">At least 8 characters.</p>
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
        </div>
      </div>

      <form action={loginWithGoogle}>
        <input type="hidden" name="callbackUrl" value="/dashboard" />
        <Button type="submit" variant="outline" className="w-full gap-2">
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
