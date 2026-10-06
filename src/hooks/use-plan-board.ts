import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useCurriculum } from "@/hooks/use-curriculum";
import { useHorizontalPan } from "@/hooks/use-horizontal-pan";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { UEA } from "@/interfaces/uea";
import type { UeaCategory } from "@/lib/category-colors";
import {
  buildSeriationEdges,
  findCurrentTrimester,
  formatApprovedRatio,
  summarizeTrimester,
  type CardRect,
} from "@/lib/plan-board";
import {
  describeUea,
  getDownstream,
  getUpstream,
  trimesterNumbers,
  ueaById,
} from "@/lib/seriation";

const DESKTOP_QUERY = "(min-width: 1024px)";
const CARD_SELECTOR = "[data-uea-id]";
const BOARD_MIN_HEIGHT = 320;
const BOARD_BOTTOM_SPACING = 90;

interface UsePlanBoardOptions {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Stretches the board to fill the space the sidebar already occupies, so it
 * never looks shorter than the viewport allows — but only as a min-height, so
 * a column with more UEAs than fit is never clipped and the page never gains
 * a new vertical scrollbar. `layoutKey` re-measures when content above shifts.
 */
function useBoardMinHeight(
  boardRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  layoutKey: unknown,
): number {
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    const board = boardRef.current;
    if (!enabled || !board) return;
    const updateMinHeight = () => {
      const boardTop = board.getBoundingClientRect().top + window.scrollY;
      setMinHeight(
        Math.max(BOARD_MIN_HEIGHT, window.innerHeight - boardTop - BOARD_BOTTOM_SPACING),
      );
    };
    updateMinHeight();
    const observer = new ResizeObserver(updateMinHeight);
    observer.observe(document.body);
    window.addEventListener("resize", updateMinHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMinHeight);
    };
  }, [boardRef, enabled, layoutKey]);

  return minHeight;
}

/**
 * Centers the focused card in the scroller; when focus ends, restores the
 * position saved through the returned `rememberScrollPosition`.
 */
function useFocusScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  focusedId: string | null,
  enabled: boolean,
): () => void {
  const savedScrollLeft = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!enabled || !scroller) return;
    if (focusedId === null) {
      scroller.scrollLeft = savedScrollLeft.current;
      return;
    }
    const card = scroller.querySelector<HTMLElement>(
      `[data-uea-id="${CSS.escape(focusedId)}"]`,
    );
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const centeringOffset = (scrollerRect.width - cardRect.width) / 2;
    scroller.scrollLeft = Math.max(
      0,
      scroller.scrollLeft + cardRect.left - scrollerRect.left - centeringOffset,
    );
  }, [scrollerRef, focusedId, enabled]);

  return () => {
    if (scrollerRef.current) savedScrollLeft.current = scrollerRef.current.scrollLeft;
  };
}

/**
 * Positions (relative to the container) of every rendered card, so seriation
 * lines can be drawn as an SVG overlay. Stale positions from a previous
 * selection are harmless: the overlay only renders while `focusedId` is set.
 */
function useCardRects(
  containerRef: RefObject<HTMLElement | null>,
  focusedId: string | null,
): Record<string, CardRect> {
  const [cardRects, setCardRects] = useState<Record<string, CardRect>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (focusedId === null || !container) return;
    const measureCards = () => {
      const containerRect = container.getBoundingClientRect();
      const measuredRects: Record<string, CardRect> = {};
      container.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        measuredRects[card.dataset.ueaId as string] = {
          top: cardRect.top - containerRect.top,
          left: cardRect.left - containerRect.left,
          width: cardRect.width,
          height: cardRect.height,
        };
      });
      setCardRects(measuredRects);
    };
    const animationFrame = requestAnimationFrame(measureCards);
    const observer = new ResizeObserver(measureCards);
    observer.observe(container);
    container.querySelectorAll(CARD_SELECTOR).forEach((card) => observer.observe(card));
    window.addEventListener("resize", measureCards);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", measureCards);
    };
  }, [containerRef, focusedId]);

  return cardRects;
}

/** Trimesters the student has expanded on mobile; starts with the current one. */
function useOpenColumns(initialTrimester: number) {
  const [openColumns, setOpenColumns] = useState<Set<number>>(
    () => new Set([initialTrimester]),
  );

  const toggleColumn = (trimester: number) =>
    setOpenColumns((previousColumns) => {
      const nextColumns = new Set(previousColumns);
      if (!nextColumns.delete(trimester)) nextColumns.add(trimester);
      return nextColumns;
    });

  const isColumnOpen = (trimester: number) => openColumns.has(trimester);

  return { isColumnOpen, toggleColumn };
}

/** State, layout measurements and seriation focus for the trimester plan board. */
export function usePlanBoard({ selectedId, onSelect }: UsePlanBoardOptions) {
  const { statuses, recordMap, changeStatus } = useCurriculum();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Focus mode (only the selected UEA's seriation chain) is a desktop-only view.
  const focusedId = isDesktop ? selectedId : null;
  const isFocusMode = focusedId !== null;

  useHorizontalPan(scrollerRef, isDesktop);
  const boardMinHeight = useBoardMinHeight(boardRef, isDesktop, isFocusMode);
  const rememberScrollPosition = useFocusScroll(scrollerRef, focusedId, isDesktop);
  const cardRects = useCardRects(boardRef, focusedId);

  const currentTrimester = findCurrentTrimester(statuses);
  const { isColumnOpen, toggleColumn } = useOpenColumns(currentTrimester);

  const upstreamIds = useMemo(
    () => (selectedId ? getUpstream(selectedId) : new Set<string>()),
    [selectedId],
  );
  const downstreamIds = useMemo(
    () => (selectedId ? getDownstream(selectedId) : new Set<string>()),
    [selectedId],
  );
  const seriationEdges = useMemo(
    () => (focusedId ? buildSeriationEdges(focusedId, upstreamIds, downstreamIds) : []),
    [focusedId, upstreamIds, downstreamIds],
  );

  const selectedUea = selectedId ? ueaById.get(selectedId) : undefined;
  const selectedName = selectedUea
    ? describeUea(selectedUea, statuses, recordMap).name
    : "";

  const isInFocusChain = (uea: UEA) =>
    uea.id === focusedId || upstreamIds.has(uea.id) || downstreamIds.has(uea.id);

  // In focus mode, a trimester left with nothing relevant disappears entirely.
  const trimesterSummaries = trimesterNumbers
    .map((trimester) =>
      summarizeTrimester(trimester, statuses, isFocusMode ? isInFocusChain : () => true),
    )
    .filter((summary) => !isFocusMode || summary.visibleUeas.length > 0);

  const getApprovedRatio = (category?: UeaCategory) =>
    formatApprovedRatio(statuses, category);

  const selectUea = (id: string | null) => {
    // Clicking the already-selected UEA again clears it, restoring the full plan.
    if (id !== null && id === selectedId) {
      onSelect(null);
      return;
    }
    const isEnteringFocus = id !== null && selectedId === null;
    if (isEnteringFocus) rememberScrollPosition();
    onSelect(id);
  };

  const clearSelection = () => selectUea(null);

  return {
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
    upstreamCount: upstreamIds.size,
    downstreamCount: downstreamIds.size,
    seriationEdges,
    getApprovedRatio,
    selectUea,
    clearSelection,
    statuses,
    recordMap,
    changeStatus,
  };
}
