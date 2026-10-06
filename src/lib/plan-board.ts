import type { UEA } from "@/interfaces/uea";
import type { UeaCategory } from "@/lib/category-colors";
import { allUeas, categoryOf, ueaById, type StatusMap } from "@/lib/seriation";

const LAST_TRIMESTER = 12;
/** Horizontal space between a card edge and the seriation line endpoint. */
const EDGE_ENDPOINT_GAP = 4;

export type SeriationDirection = "upstream" | "downstream";

export interface SeriationEdge {
  fromId: string;
  toId: string;
  direction: SeriationDirection;
}

export interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface EdgeGeometry {
  start: Point;
  end: Point;
  path: string;
}

export interface TrimesterSummary {
  trimester: number;
  label: string;
  ueas: UEA[];
  visibleUeas: UEA[];
  approvedCount: number;
  totalCredits: number;
  progressPercent: number;
}

const isApproved = (uea: UEA, statuses: StatusMap) =>
  statuses.get(uea.id) === "approved";

/** Earliest trimester with a UEA in progress, or else the first one not fully approved. */
export function findCurrentTrimester(statuses: StatusMap): number {
  const inProgressUeas = allUeas.filter(
    (uea) => statuses.get(uea.id) === "in-progress",
  );
  if (inProgressUeas.length > 0) {
    return Math.min(...inProgressUeas.map((uea) => uea.trimester));
  }
  const firstPending = allUeas.find((uea) => !isApproved(uea, statuses));
  return firstPending?.trimester ?? LAST_TRIMESTER;
}

/** "approved/total" for every UEA, or only those of the given category. */
export function formatApprovedRatio(
  statuses: StatusMap,
  category?: UeaCategory,
): string {
  const ueas = category
    ? allUeas.filter((uea) => categoryOf(uea) === category)
    : allUeas;
  const approvedCount = ueas.filter((uea) => isApproved(uea, statuses)).length;
  return `${approvedCount}/${ueas.length}`;
}

export const getTrimesterLabel = (trimester: number) =>
  trimester === 0 ? "Introductorio" : `Trimestre ${trimester}`;

/**
 * Progress of one trimester. Totals always cover the whole trimester, while
 * `visibleUeas` holds only the UEAs that pass `isVisible`.
 */
export function summarizeTrimester(
  trimester: number,
  statuses: StatusMap,
  isVisible: (uea: UEA) => boolean,
): TrimesterSummary {
  const ueas = allUeas.filter((uea) => uea.trimester === trimester);
  const approvedCount = ueas.filter((uea) => isApproved(uea, statuses)).length;
  return {
    trimester,
    label: getTrimesterLabel(trimester),
    ueas,
    visibleUeas: ueas.filter(isVisible),
    approvedCount,
    totalCredits: ueas.reduce((sum, uea) => sum + uea.credits, 0),
    progressPercent: (approvedCount / ueas.length) * 100,
  };
}

/**
 * Direct seriation links between the UEAs of a focus chain: upstream edges
 * lead up to the selected UEA, downstream edges leave from it.
 */
export function buildSeriationEdges(
  selectedId: string,
  upstreamIds: ReadonlySet<string>,
  downstreamIds: ReadonlySet<string>,
): SeriationEdge[] {
  const edges: SeriationEdge[] = [];
  const requirementsOf = (id: string) => ueaById.get(id)?.seriation ?? [];

  for (const toId of [...upstreamIds, selectedId]) {
    for (const fromId of requirementsOf(toId)) {
      if (upstreamIds.has(fromId)) {
        edges.push({ fromId, toId, direction: "upstream" });
      }
    }
  }
  for (const toId of downstreamIds) {
    for (const fromId of requirementsOf(toId)) {
      if (downstreamIds.has(fromId) || fromId === selectedId) {
        edges.push({ fromId, toId, direction: "downstream" });
      }
    }
  }
  return edges;
}

/** Bezier curve from the right edge of one card to the left edge of another. */
export function buildEdgeGeometry(from: CardRect, to: CardRect): EdgeGeometry {
  const start = {
    x: from.left + from.width + EDGE_ENDPOINT_GAP,
    y: from.top + from.height / 2,
  };
  const end = { x: to.left - EDGE_ENDPOINT_GAP, y: to.top + to.height / 2 };
  const middleX = (start.x + end.x) / 2;
  return {
    start,
    end,
    path: `M${start.x},${start.y} C${middleX},${start.y} ${middleX},${end.y} ${end.x},${end.y}`,
  };
}
