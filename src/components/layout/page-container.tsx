import { cn } from "@/lib/utils";

interface PageContainerProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-6 p-6 md:p-12.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
