import { ChevronDown } from "lucide-react";
import { StatusIcon, stateLabels } from "@/components/status-icon";
import { UeaNode } from "@/components/uea-node";
import { Button } from "@/components/ui/button";
import { usePlanBoard } from "@/hooks/use-plan-board";
import type { UEA } from "@/interfaces/uea";
import { categoryLabels, type UeaCategory } from "@/lib/category-colors";
import {
  buildEdgeGeometry,
  type CardRect,
  type SeriationEdge,
  type TrimesterSummary,
} from "@/lib/plan-board";
import {
  categoryOf,
  describeUea,
  type RecordMap,
  type StatusMap,
  type UeaStatus,
} from "@/lib/seriation";
import { cn } from "@/lib/utils";

export type PlanFilter = "all" | UeaCategory;

interface Props {
  selectedId: string | null;
  filter: PlanFilter;
  onFilterChange: (filter: PlanFilter) => void;
  onSelect: (id: string | null) => void;
}

const filterOptions = [
  "all",
  "tronco",
  "computacion",
  "optativa",
  "proyecto",
] as const;
const legendStates = [
  "locked",
  "available",
  "in-progress",
  "approved",
] as const;

export function PlanView({
  selectedId,
  filter,
  onFilterChange,
  onSelect,
}: Readonly<Props>) {
  const {
    scrollerRef,
    boardRef,
    isDesktop,
    isFocusMode,
    boardMinHeight,
    cardRects,
    currentTrimester,
    trimesterSummaries,
    isColumnOpen,
    toggleColumn,
    selectedName,
    upstreamCount,
    downstreamCount,
    seriationEdges,
    getApprovedRatio,
    selectUea,
    clearSelection,
    statuses,
    recordMap,
    changeStatus,
  } = usePlanBoard({ selectedId, onSelect });

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <CategoryFilter
          filter={filter}
          onFilterChange={onFilterChange}
          getApprovedRatio={getApprovedRatio}
        />
        <StatusLegend />
      </div>

      {isFocusMode && (
        <FocusBanner
          selectedName={selectedName}
          upstreamCount={upstreamCount}
          downstreamCount={downstreamCount}
          onShowFullPlan={clearSelection}
        />
      )}

      <div
        ref={scrollerRef}
        className={cn(
          "lg:-mx-1 lg:overflow-x-auto lg:px-1 lg:pb-3.5 lg:select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          isDesktop && "cursor-grab active:cursor-grabbing",
        )}
      >
        <div
          ref={boardRef}
          className="relative flex flex-col gap-2.5 lg:w-max lg:flex-row lg:items-stretch lg:gap-4"
          style={
            isDesktop && boardMinHeight
              ? { minHeight: boardMinHeight }
              : undefined
          }
        >
          {isFocusMode && (
            <SeriationLines edges={seriationEdges} cardRects={cardRects} />
          )}
          {trimesterSummaries.map((summary) => (
            <TrimesterColumn
              key={summary.trimester}
              summary={summary}
              isCurrent={summary.trimester === currentTrimester}
              isOpen={isColumnOpen(summary.trimester)}
              onToggle={() => toggleColumn(summary.trimester)}
              selectedId={selectedId}
              filter={filter}
              statuses={statuses}
              recordMap={recordMap}
              onSelect={selectUea}
              onCycle={changeStatus}
            />
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Toca una UEA para ver su seriación.{""}
        <span className="hidden lg:inline">
          {" "}
          Desplaza con la rueda del mouse o arrastra el mapa.
        </span>
      </p>
    </div>
  );
}

interface CategoryFilterProps {
  filter: PlanFilter;
  onFilterChange: (filter: PlanFilter) => void;
  getApprovedRatio: (category?: UeaCategory) => string;
}

function CategoryFilter({
  filter,
  onFilterChange,
  getApprovedRatio,
}: Readonly<CategoryFilterProps>) {
  return (
    <fieldset className="m-0 flex flex-wrap gap-1.5 border-0 p-0">
      <legend className="sr-only">Filtrar por categoría</legend>
      {filterOptions.map((option) => {
        const category = option === "all" ? undefined : option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => onFilterChange(option)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium",
              filter === option
                ? "border-foreground bg-foreground text-background"
                : "bg-card hover:border-muted-foreground",
            )}
          >
            {category && (
              <span
                className="size-[9px] rounded-[3px]"
                style={{ backgroundColor: `var(--category-${category})` }}
                aria-hidden="true"
              />
            )}
            {category ? categoryLabels[category] : "Todas"}
            <span className="font-mono text-[11px] opacity-75">
              {getApprovedRatio(category)}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}

function StatusLegend() {
  return (
    <ul
      className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-muted-foreground"
      aria-label="Leyenda de estados"
    >
      {legendStates.map((state) => (
        <li key={state} className="inline-flex items-center gap-1.5">
          <StatusIcon
            state={state === "locked" ? "lock" : state}
            className="size-4"
          />
          {stateLabels[state]}
        </li>
      ))}
    </ul>
  );
}

interface FocusBannerProps {
  selectedName: string;
  upstreamCount: number;
  downstreamCount: number;
  onShowFullPlan: () => void;
}

function FocusBanner({
  selectedName,
  upstreamCount,
  downstreamCount,
  onShowFullPlan,
}: Readonly<FocusBannerProps>) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2 rounded-xl bg-foreground py-2 pr-2 pl-3.5 text-[13px] text-background">
      <span>
        Solo la seriación de <b>{selectedName}</b>: {upstreamCount} antes,{" "}
        {downstreamCount} después
      </span>
      <Button size="sm" variant="secondary" onClick={onShowFullPlan}>
        Ver plan completo
      </Button>
    </div>
  );
}

interface SeriationLinesProps {
  edges: SeriationEdge[];
  cardRects: Record<string, CardRect>;
}

/**
 * Rendered before the columns so the cards paint over it: a line that crosses
 * an intermediate trimester passes behind its cards instead of covering their
 * text. Endpoints sit in the column gap to stay visible. Requirements leading
 * up to the selected UEA are solid; what it opens is dashed.
 */
function SeriationLines({ edges, cardRects }: Readonly<SeriationLinesProps>) {
  if (edges.length === 0) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full overflow-visible text-foreground"
      aria-hidden="true"
    >
      {edges.map((edge) => {
        const fromRect = cardRects[edge.fromId];
        const toRect = cardRects[edge.toId];
        if (!fromRect || !toRect) return null;
        const { start, end, path } = buildEdgeGeometry(fromRect, toRect);
        return (
          <g key={`${edge.fromId}->${edge.toId}`} className="opacity-70">
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray={
                edge.direction === "downstream" ? "5 4" : undefined
              }
            />
            <circle
              cx={start.x}
              cy={start.y}
              r="2.5"
              strokeWidth="1.5"
              stroke="currentColor"
              className="fill-card"
            />
            <circle cx={end.x} cy={end.y} r="3.5" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}

interface TrimesterColumnProps {
  summary: TrimesterSummary;
  isCurrent: boolean;
  isOpen: boolean;
  onToggle: () => void;
  selectedId: string | null;
  filter: PlanFilter;
  statuses: StatusMap;
  recordMap: RecordMap;
  onSelect: (id: string) => void;
  onCycle: (uea: UEA, status: UeaStatus) => void;
}

function TrimesterColumn({
  summary,
  isCurrent,
  isOpen,
  onToggle,
  selectedId,
  filter,
  statuses,
  recordMap,
  onSelect,
  onCycle,
}: Readonly<TrimesterColumnProps>) {
  const {
    trimester,
    label,
    ueas,
    visibleUeas,
    approvedCount,
    totalCredits,
    progressPercent,
  } = summary;
  return (
    <section
      aria-label={label}
      className={cn(
        "rounded-2xl border bg-card/55 lg:flex lg:w-[214px] lg:flex-none lg:flex-col lg:rounded-none lg:border-0 lg:bg-transparent",
        isCurrent && "border-foreground",
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left lg:pointer-events-none lg:px-0.5 lg:pt-0 lg:pb-2.5"
      >
        <span
          className={cn(
            "font-display min-w-[34px] text-[22px] leading-none font-bold tracking-tight tabular-nums",
            isCurrent &&
              "lg:underline lg:decoration-[3px] lg:underline-offset-[5px]",
          )}
        >
          T{trimester}
        </span>
        <span className="flex flex-1 flex-col text-xs text-muted-foreground">
          <b className="text-[13px] font-semibold text-foreground">{label}</b>
          <span className="tabular-nums">
            {approvedCount}/{ueas.length} · {totalCredits} cr
          </span>
        </span>
        <span
          className="block h-1 w-11 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <i
            className="block h-full bg-foreground"
            style={{ width: `${progressPercent}%` }}
          />
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform lg:hidden",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <ul
        aria-label={`Materias del ${label.toLowerCase()}`}
        className={cn(
          "m-0 list-none p-0 gap-2 px-2.5 pb-2.5 min-[600px]:grid-cols-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:gap-3 lg:p-0",
          isOpen ? "grid grid-cols-1" : "hidden",
        )}
      >
        {visibleUeas.map((uea) => (
          <li key={uea.id} className="list-none">
            <UeaNode
              view={describeUea(uea, statuses, recordMap)}
              selected={selectedId === uea.id}
              faded={filter !== "all" && categoryOf(uea) !== filter}
              style={{ viewTransitionName: `uea-${uea.id}` }}
              onSelect={onSelect}
              onCycle={onCycle}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
