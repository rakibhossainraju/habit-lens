"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/google-icon";
import { loginWithMagicLink, loginWithGoogle } from "./actions";

function MagicLinkSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Please wait…" : "Email me a sign-in link"}
    </Button>
  );
}

interface LoginFormProps {
  callbackUrl: string;
  initialError?: string;
}

export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [magicState, magicAction] = useActionState(loginWithMagicLink, undefined);
  const [credPending, setCredPending] = useState(false);
  const [credError, setCredError] = useState<string | undefined>();

  const error = (mode === "password" ? credError : magicState?.error) ?? initialError;

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCredPending(true);
    setCredError(undefined);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setCredError("Incorrect email or password.");
      setCredPending(false);
      return;
    }

    // A full reload (rather than client-side routing) so the session
    // provider picks up the freshly signed-in session on first render.
    window.location.href = callbackUrl;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2" role="alert">
          {error}
        </p>
      )}

      {mode === "password" ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
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
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <Button type="submit" className="w-full" disabled={credPending}>
            {credPending ? "Please wait…" : "Sign in"}
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-3">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="magic-email">
              Email
            </label>
            <Input
              id="magic-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <MagicLinkSubmitButton />
        </form>
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "password" ? "magic-link" : "password")}
        className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
      >
        {mode === "password" ? (
          <>
            <Mail className="size-3.5" strokeWidth={1.75} />
            Use a magic link instead
          </>
        ) : (
          <>
            <KeyRound className="size-3.5" strokeWidth={1.75} />
            Use a password instead
          </>
        )}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
        </div>
      </div>

      <form action={loginWithGoogle}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button type="submit" variant="outline" className="w-full gap-2">
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
