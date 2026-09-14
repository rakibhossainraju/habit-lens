import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
          HL
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight leading-none text-foreground">
            Habit Lens
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">
            Understand yourself better
          </span>
        </div>
      </Link>

      <Card className={cn("w-full max-w-sm", className)}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">{children}</CardContent>
      </Card>

      {footer && <div className="mt-6 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}
