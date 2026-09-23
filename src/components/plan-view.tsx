import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FocusDiagram } from "@/components/focus-diagram";
import { StatusIcon, stateLabels } from "@/components/status-icon";
import { UeaNode } from "@/components/uea-node";
import { Button } from "@/components/ui/button";
import { useCurriculum } from "@/hooks/use-curriculum";
import { useHorizontalPan } from "@/hooks/use-horizontal-pan";
import { useMediaQuery } from "@/hooks/use-media-query";
import { categoryLabels, type UeaCategory } from "@/lib/category-colors";
import {
  allUeas,
  categoryOf,
  describeUea,
  getDownstream,
  getUpstream,
  trimesterNumbers,
  ueaById,
} from "@/lib/seriation";
import { cn } from "@/lib/utils";

export type PlanFilter = "all" | UeaCategory;

interface Props {
  selectedId: string | null;
  filter: PlanFilter;
  onFilterChange: (filter: PlanFilter) => void;
  onSelect: (id: string | null) => void;
}

const categories = ["tronco", "computacion", "optativa", "proyecto"] as const;

export function PlanView({ selectedId, filter, onFilterChange, onSelect }: Props) {
  const { statuses, recordMap, changeStatus } = useCurriculum();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  const focusOn = isDesktop && selectedId !== null;
  useHorizontalPan(scrollerRef, isDesktop);

  // Stretch the trimester board to fill the space the sidebar already
  // occupies, so it never looks shorter than the viewport allows — but
  // only as a min-height, so a column with more UEAs than fit is never
  // clipped and the page never gains a new vertical scrollbar.
  const [rowAvailable, setRowAvailable] = useState(0);
  useEffect(() => {
    if (!isDesktop || focusOn) return;
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      const top = row.getBoundingClientRect().top + window.scrollY;
      setRowAvailable(Math.max(320, window.innerHeight - top - 90));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isDesktop, focusOn]);

  const currentTrimester = (() => {
    const started = allUeas.filter((u) => statuses.get(u.id) === "in-progress");
    if (started.length) return Math.min(...started.map((u) => u.trimester));
    return allUeas.find((u) => statuses.get(u.id) !== "approved")?.trimester ?? 12;
  })();
  const [openColumns, setOpenColumns] = useState<Set<number>>(() => new Set([currentTrimester]));

  // Entering focus remembers the map position; leaving restores it.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isDesktop) return;
    if (!focusOn) {
      scroller.scrollLeft = savedScroll.current;
      return;
    }
    const card = scroller.querySelector<HTMLElement>(`[data-uea-id="${CSS.escape(selectedId as string)}"]`);
    if (card) {
      const c = card.getBoundingClientRect();
      const s = scroller.getBoundingClientRect();
      scroller.scrollLeft = Math.max(0, scroller.scrollLeft + c.left - s.left - (s.width - c.width) / 2);
    }
  }, [focusOn, selectedId, isDesktop]);

  const upstream = selectedId ? getUpstream(selectedId) : new Set<string>();
  const downstream = selectedId ? getDownstream(selectedId) : new Set<string>();
  const selectedName = selectedId ? describeUea(ueaById.get(selectedId)!, statuses, recordMap).name : "";

  const counts = (category?: UeaCategory) => {
    const list = category ? allUeas.filter((u) => categoryOf(u) === category) : allUeas;
    return `${list.filter((u) => statuses.get(u.id) === "approved").length}/${list.length}`;
  };

  const select = (id: string | null) => {
    if (id && !selectedId && scrollerRef.current) savedScroll.current = scrollerRef.current.scrollLeft;
    onSelect(id);
  };

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-1.5">
          {(["all", ...categories] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => onFilterChange(key)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium",
                filter === key ? "border-foreground bg-foreground text-background" : "bg-card hover:border-muted-foreground",
              )}
            >
              {key !== "all" && (
                <span
                  className="size-[9px] rounded-[3px]"
                  style={{ backgroundColor: `var(--category-${key})` }}
                  aria-hidden="true"
                />
              )}
              {key === "all" ? "Todas" : categoryLabels[key]}
              <span className="font-mono text-[11px] opacity-75">{counts(key === "all" ? undefined : key)}</span>
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-muted-foreground" aria-label="Leyenda de estados">
          {(["locked", "available", "in-progress", "approved"] as const).map((state) => (
            <li key={state} className="inline-flex items-center gap-1.5">
              <StatusIcon state={state === "locked" ? "lock" : state} className="size-4" />
              {stateLabels[state]}
            </li>
          ))}
        </ul>
      </div>

      {focusOn && (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2 rounded-xl bg-foreground py-2 pr-2 pl-3.5 text-[13px] text-background">
          <span>
            Solo la seriación de <b>{selectedName}</b>: {upstream.size} antes, {downstream.size} después
          </span>
          <Button size="sm" variant="secondary" onClick={() => select(null)}>
            Ver plan completo
          </Button>
        </div>
      )}

      <div
        ref={scrollerRef}
        className={cn("lg:-mx-1 lg:overflow-x-auto lg:px-1 lg:pb-3.5 lg:select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", isDesktop && "cursor-grab active:cursor-grabbing")}
      >
        {focusOn && selectedId ? (
          <FocusDiagram selectedId={selectedId} onSelect={select} />
        ) : (
          <div
            ref={rowRef}
            className="flex flex-col gap-2.5 lg:w-max lg:flex-row lg:items-stretch lg:gap-4"
            style={isDesktop && rowAvailable ? { minHeight: rowAvailable } : undefined}
          >
            {trimesterNumbers.map((trimester) => {
              const list = allUeas.filter((u) => u.trimester === trimester);
              const done = list.filter((u) => statuses.get(u.id) === "approved").length;
              const credits = list.reduce((sum, u) => sum + u.credits, 0);
              const open = openColumns.has(trimester);
              const label = trimester === 0 ? "Introductorio" : `Trimestre ${trimester}`;
              return (
                <section
                  key={trimester}
                  aria-label={label}
                  className={cn(
                    "rounded-2xl border bg-card/55 lg:flex lg:w-[214px] lg:flex-none lg:flex-col lg:rounded-none lg:border-0 lg:bg-transparent",
                    trimester === currentTrimester && "border-foreground",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenColumns((cols) => {
                        const next = new Set(cols);
                        if (!next.delete(trimester)) next.add(trimester);
                        return next;
                      })
                    }
                    className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left lg:pointer-events-none lg:px-0.5 lg:pt-0 lg:pb-2.5"
                  >
                    <span
                      className={cn(
                        "font-display min-w-[34px] text-[22px] leading-none font-bold tracking-tight tabular-nums",
                        trimester === currentTrimester && "lg:underline lg:decoration-[3px] lg:underline-offset-[5px]",
                      )}
                    >
                      T{trimester}
                    </span>
                    <span className="flex flex-1 flex-col text-xs text-muted-foreground">
                      <b className="text-[13px] font-semibold text-foreground">{label}</b>
                      <span className="tabular-nums">
                        {done}/{list.length} · {credits} cr
                      </span>
                    </span>
                    <span className="block h-1 w-11 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <i className="block h-full bg-foreground" style={{ width: `${(done / list.length) * 100}%` }} />
                    </span>
                    <ChevronDown className={cn("size-4 text-muted-foreground transition-transform lg:hidden", open && "rotate-180")} aria-hidden="true" />
                  </button>
                  <div
                    role="list"
                    aria-label={`Materias del ${label.toLowerCase()}`}
                    className={cn(
                      "gap-2 px-2.5 pb-2.5 min-[600px]:grid-cols-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-0",
                      open ? "grid grid-cols-1" : "hidden",
                    )}
                  >
                    {list.map((uea) => (
                      <UeaNode
                        key={uea.id}
                        role="listitem"
                        view={describeUea(uea, statuses, recordMap)}
                        selected={selectedId === uea.id}
                        faded={filter !== "all" && categoryOf(uea) !== filter}
                        onSelect={select}
                        onCycle={changeStatus}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Toca una UEA para ver su seriación.
        <span className="hidden lg:inline"> Desplaza con la rueda del mouse o arrastra el mapa.</span>
      </p>
    </div>
  );
}
