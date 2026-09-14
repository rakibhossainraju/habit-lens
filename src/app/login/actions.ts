"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginFormState = { error?: string } | undefined;

function resolveCallbackUrl(formData: FormData) {
  const value = formData.get("callbackUrl");
  return typeof value === "string" && value.startsWith("/") ? value : "/dashboard";
}

// Credentials sign-in happens client-side (see login-form.tsx) via
// next-auth/react's `signIn`, not as a server action — see the comment in
// register/actions.ts for why.

export async function loginWithMagicLink(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return { error: "Enter your email address." };
  }

  try {
    await signIn("nodemailer", { email, redirectTo: resolveCallbackUrl(formData) });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Couldn't send the sign-in link. Try again in a moment." };
    }
    throw error;
  }
}

export async function loginWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: resolveCallbackUrl(formData) });
}
