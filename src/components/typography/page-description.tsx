import { cn } from "@/lib/utils";

interface PageDescriptionProps extends React.ComponentProps<"p"> {
  children: React.ReactNode;
}

export function PageDescription({ className, children, ...props }: PageDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}
