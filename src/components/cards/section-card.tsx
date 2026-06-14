import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm";
  action?: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
  className,
  size = "default",
  action,
}: SectionCardProps) {
  return (
    <Card size={size} className={cn(className)}>
      {(title || description || action) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <div className="col-start-2 row-span-2 self-start">{action}</div>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
