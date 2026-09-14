import { MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth-card";

export default function VerifyRequestPage() {
  return (
    <AuthCard
      title="Check your email"
      description="We've sent a sign-in link to your inbox. Open it on this device to continue."
    >
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <MailCheck className="size-5" strokeWidth={1.75} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The link is valid for a limited time. If it doesn&apos;t arrive shortly, check your spam folder or try
          again.
        </p>
      </div>
    </AuthCard>
  );
}
