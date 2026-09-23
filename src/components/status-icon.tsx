import type { NodeState } from "@/lib/seriation";
import { cn } from "@/lib/utils";

interface Props {
  state: NodeState | "lock";
  className?: string;
}

export function StatusIcon({ state, className }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
    className: cn("size-5 shrink-0", className),
  } as const;

  if (state === "approved") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" className="fill-foreground" />
        <path d="M7.6 12.4l3 3 5.8-6.4" className="stroke-background" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === "in-progress") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" className="stroke-foreground" strokeWidth="2" />
        <path d="M12 2.5a9.5 9.5 0 0 0 0 19z" className="fill-foreground" />
      </svg>
    );
  }
  if (state === "available") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" className="stroke-muted-foreground" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export const stateLabels: Record<NodeState, string> = {
  approved: "Aprobada",
  "in-progress": "En curso",
  available: "Disponible",
  locked: "Bloqueada",
};
