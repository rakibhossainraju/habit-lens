import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="A quiet space to log daily habits and observe patterns over time."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:text-primary transition-colors">
            Sign in
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
