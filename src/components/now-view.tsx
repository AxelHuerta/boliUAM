import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UeaNode } from "@/components/uea-node";
import { useCurriculum } from "@/hooks/use-curriculum";
import type { UeaCategory } from "@/lib/category-colors";
import { allUeas, describeUea } from "@/lib/seriation";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenPlan: (filter: UeaCategory) => void;
}

const VISIBLE_AVAILABLE = 6;

export function NowView({ selectedId, onSelect, onOpenPlan }: Props) {
  const { statuses, recordMap, changeStatus } = useCurriculum();
  const [showAll, setShowAll] = useState(false);

  const views = allUeas.map((uea) => describeUea(uea, statuses, recordMap));
  const inProgress = views.filter((v) => v.state === "in-progress");
  const available = views.filter((v) => v.state === "available" && v.uea.type !== "optativa");
  const almostUnlocked = views.filter(
    (v) => v.state === "locked" && v.unmet.every((u) => u.status === "in-progress"),
  );
  const optativas = views.filter((v) => v.uea.type === "optativa");
  const optativasDone = optativas.filter((v) => statuses.get(v.uea.id) === "approved").length;
  const visibleAvailable = showAll ? available : available.slice(0, VISIBLE_AVAILABLE);

  const renderGroup = (
    id: string,
    title: string,
    subtitle: string,
    items: typeof views,
    empty: string,
    footer?: React.ReactNode,
  ) => (
    <section aria-labelledby={id} className="mb-7">
      <div className="mb-2.5 flex items-baseline gap-2.5">
        <h2 id={id} className="font-display text-lg font-bold">
          {title}
        </h2>
        <span className="text-[12.5px] text-muted-foreground tabular-nums">{subtitle}</span>
      </div>
      {items.length ? (
        <>
          <div
            role="list"
            aria-label={title}
            className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5"
          >
            {items.map((view) => (
              <UeaNode
                key={view.uea.id}
                role="listitem"
                view={view}
                selected={selectedId === view.uea.id}
                onSelect={onSelect}
                onCycle={changeStatus}
              />
            ))}
          </div>
          {footer}
        </>
      ) : (
        <p className="rounded-xl border border-dashed p-4 text-muted-foreground">{empty}</p>
      )}
    </section>
  );

  return (
    <div>
      {renderGroup(
        "now-in-progress",
        "En curso",
        `${inProgress.length} UEAs · ${inProgress.reduce((sum, v) => sum + v.credits, 0)} cr`,
        inProgress,
        "No marcaste nada en curso. Elige una de las que ya puedes cursar.",
      )}
      {renderGroup(
        "now-available",
        "Puedes cursar",
        `${available.length} con seriación cumplida`,
        visibleAvailable,
        "Aprueba las UEAs en curso para abrir las siguientes.",
        available.length > VISIBLE_AVAILABLE && (
          <Button variant="outline" size="sm" className="mt-2.5 rounded-full" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Ver menos" : `Ver ${available.length - VISIBLE_AVAILABLE} más`}
          </Button>
        ),
      )}
      {almostUnlocked.length > 0 &&
        renderGroup(
          "now-almost",
          "Casi desbloqueadas",
          "se abren al aprobar lo que ya cursas",
          almostUnlocked,
          "",
        )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-xl border bg-card px-3.5 py-3">
        <p className="text-muted-foreground">
          <b className="font-semibold text-foreground tabular-nums">
            {optativasDone} de {optativas.length}
          </b>{" "}
          optativas elegidas · se cursan desde el trimestre 9
        </p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => onOpenPlan("optativa")}>
          Ver optativas en el plan
        </Button>
      </div>
    </div>
  );
}
