import { Check, Lock } from "lucide-react";
import { StatusIcon, stateLabels } from "@/components/status-icon";
import { capitalize, categoryOf, nextStatus, type UeaView } from "@/lib/seriation";
import { cn } from "@/lib/utils";
import type { UEA } from "@/interfaces/uea";
import type { CSSProperties } from "react";

interface Props {
  view: UeaView;
  selected?: boolean;
  /** Fades the card out when it is not part of the current focus or filter. */
  faded?: boolean;
  showTrimester?: boolean;
  role?: string;
  className?: string;
  style?: CSSProperties;
  onSelect: (id: string) => void;
  onCycle: (uea: UEA, status: ReturnType<typeof nextStatus>) => void;
}

const stateStyles = {
  approved: "border-transparent bg-muted [&_h3]:text-muted-foreground",
  "in-progress": "border-[1.5px] border-foreground shadow-md",
  locked: "border-dashed bg-hatch text-muted-foreground [&_h3]:text-muted-foreground",
  available: "hover:border-muted-foreground",
} as const;

export function UeaNode({
  view,
  selected,
  faded,
  showTrimester,
  role,
  className,
  style,
  onSelect,
  onCycle,
}: Props) {
  const { uea, state, name, credits, clave, unmet } = view;
  const locked = state === "locked";
  const next = nextStatus(state);
  const nextLabel =
    next === "in-progress" ? "En curso" : next === "approved" ? "Aprobada" : "Pendiente";

  return (
    <article
      role={role}
      data-uea-id={uea.id}
      style={style}
      className={cn(
        "relative flex flex-col gap-1.5 rounded-[10px] border bg-card px-3 py-2.5 transition-[opacity,border-color,box-shadow]",
        stateStyles[state],
        selected && "outline-2 outline-offset-2 outline-foreground",
        faded && "opacity-30",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <span
          className="size-[9px] shrink-0 rounded-[3px]"
          style={{ backgroundColor: `var(--category-${categoryOf(uea)})` }}
          aria-hidden="true"
        />
        <span>
          {clave}
          {showTrimester ? ` · T${uea.trimester}` : ""}
        </span>
        <span className="ml-auto font-medium tabular-nums text-foreground">{credits} cr</span>
      </div>

      <h3 className="text-sm leading-tight font-semibold text-balance">
        <button
          type="button"
          onClick={() => onSelect(uea.id)}
          aria-label={`${name}, ${credits} créditos, ${stateLabels[state]}. Ver seriación`}
          className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-[10px] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-foreground"
        >
          {name}
        </button>
      </h3>

      {locked && (
        <p className="flex items-start gap-1.5 text-xs leading-snug text-muted-foreground">
          <Lock className="mt-px size-3 shrink-0" aria-hidden="true" />
          <span>
            Requiere{" "}
            {unmet
              .map(
                ({ uea: required, status }) =>
                  `${capitalize(required.name)}${status === "in-progress" ? " (en curso)" : ""}`,
              )
              .join(" y ")}
          </span>
        </p>
      )}
      {state === "available" && uea.seriation.length > 0 && (
        <p className="flex items-start gap-1.5 text-xs leading-snug text-muted-foreground">
          <Check className="mt-px size-3 shrink-0" aria-hidden="true" />
          <span>Seriación cumplida</span>
        </p>
      )}

      <div className="mt-0.5 flex items-center justify-between">
        <span className={cn("text-xs font-semibold", state === "approved" && "font-medium")}>
          {stateLabels[state]}
        </span>
        {locked ? (
          <button
            type="button"
            onClick={() => onSelect(uea.id)}
            aria-label="Ver por qué está bloqueada"
            className="relative z-10 -mr-1.5 -my-1.5 grid size-[34px] cursor-pointer place-items-center rounded-full hover:bg-muted"
          >
            <StatusIcon state="lock" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCycle(uea, next)}
            aria-label={`${name}: ${stateLabels[state]}. Cambiar a ${nextLabel}`}
            className="relative z-10 -mr-1.5 -my-1.5 grid size-[34px] cursor-pointer place-items-center rounded-full hover:bg-muted"
          >
            <StatusIcon state={state} className="size-[22px]" />
          </button>
        )}
      </div>
    </article>
  );
}
