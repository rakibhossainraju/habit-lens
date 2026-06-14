import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.ComponentProps<"h2"> {
  children: React.ReactNode;
}

export function SectionTitle({ className, children, ...props }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "font-heading text-xl font-normal tracking-tight text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
