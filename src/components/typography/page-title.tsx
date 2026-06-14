import { cn } from "@/lib/utils";

interface PageTitleProps extends React.ComponentProps<"h1"> {
  children: React.ReactNode;
}

export function PageTitle({ className, children, ...props }: PageTitleProps) {
  return (
    <h1
      className={cn(
        "font-heading text-3xl font-normal tracking-tight text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
