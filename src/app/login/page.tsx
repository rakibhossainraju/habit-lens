import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "./login-form";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "That email is already registered with a different sign-in method. Try the way you signed up originally.",
  AccessDenied: "Access was denied.",
  Verification: "That sign-in link has expired or was already used.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

async function LoginFormWithParams({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl && params.callbackUrl.startsWith("/") ? params.callbackUrl : "/dashboard";
  const initialError = params.error
    ? (ERROR_MESSAGES[params.error] ?? "Something went wrong signing you in. Please try again.")
    : undefined;

  return <LoginForm callbackUrl={callbackUrl} initialError={initialError} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to pick up your logs and insights where you left off."
      footer={
        <span>
          New to Habit Lens?{" "}
          <Link href="/register" className="text-foreground hover:text-primary transition-colors">
            Create an account
          </Link>
        </span>
      }
    >
      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted/40" />}>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
