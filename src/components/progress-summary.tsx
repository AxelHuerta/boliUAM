import { useProgress, getTotalCredits } from "@/lib/progress-calc";
import { categoryLabels, type UeaCategory } from "@/lib/category-colors";
import { cn } from "@/lib/utils";

const categories = ["tronco", "computacion", "optativa", "proyecto"] as const;

export function ProgressSummary({ className }: { className?: string }) {
  const {
    approvedCredits,
    inProgressCredits,
    approvedCount,
    inProgressCount,
    totalCount,
    creditsPercentage,
    approvedByCategory,
  } = useProgress();
  const total = getTotalCredits();
  const width = (credits: number) => `${(credits / total) * 100}%`;

  return (
    <section
      aria-labelledby="progress-summary"
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 rounded-2xl border bg-card px-4 py-3.5 lg:py-2.5",
        className,
      )}
    >
      <h2 id="progress-summary" className="sr-only">
        Progreso académico
      </h2>
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-display text-[40px] leading-none font-bold tracking-tight tabular-nums"
          aria-label={`${creditsPercentage.toFixed(0)} por ciento de avance del plan`}
        >
          {Math.round(creditsPercentage)}%
        </span>
        <span className="text-xs text-muted-foreground">del plan</span>
      </div>

      <div
        className="flex h-2.5 gap-px overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${approvedCredits} de ${total} créditos aprobados, ${inProgressCredits} en curso`}
      >
        {categories.map(
          (category: UeaCategory) =>
            approvedByCategory[category] ? (
              <i
                key={category}
                className="block h-full"
                style={{
                  width: width(approvedByCategory[category] ?? 0),
                  backgroundColor: `var(--category-${category})`,
                }}
                title={`${categoryLabels[category]}: ${approvedByCategory[category]} cr`}
              />
            ) : null,
        )}
        <i
          className="block h-full bg-progress-stripes opacity-55"
          style={{ width: width(inProgressCredits) }}
        />
      </div>

      <p className="col-span-2 text-[12.5px] text-muted-foreground tabular-nums">
        <b className="font-semibold text-foreground">{approvedCredits}</b> de {total} créditos ·{" "}
        <b className="font-semibold text-foreground">{approvedCount}</b> de {totalCount} UEAs
        aprobadas · <b className="font-semibold text-foreground">{inProgressCount}</b> en curso (
        {inProgressCredits} cr)
      </p>
    </section>
  );
}
