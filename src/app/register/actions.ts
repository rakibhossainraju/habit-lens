"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Enter a valid email address." }),
  password: z.string().min(8, { message: "Use at least 8 characters." }),
});

export type RegisterFormState = { error?: string } | undefined;

export async function registerUser(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({ data: { name, email, password: hashedPassword } });

  // Signing the new user in happens client-side (see register-form.tsx) via
  // next-auth/react's `signIn`, which does a full page navigation on success.
  // A server-action `signIn()` here would redirect through the Next.js
  // router instead, and the client SessionProvider (set once, high in the
  // tree) never re-fetches on that kind of soft navigation — the top nav
  // would keep showing the signed-out state despite a valid session cookie.
}
