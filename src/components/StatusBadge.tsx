import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { className: string; text: string }> = {
    active: {
      className: "bg-success/10 text-success hover:bg-success/20",
      text: "Active",
    },
    pending: {
      className: "bg-warning/10 text-warning hover:bg-warning/20",
      text: "Pending",
    },
    inactive: {
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      text: "Inactive",
    },
  };

  const variant = variants[status.toLowerCase()] || variants.active;

  return <Badge className={variant.className}>{variant.text}</Badge>;
}
