import { useEffect, useMemo, useRef, useState } from "react";
import { UeaNode } from "@/components/uea-node";
import { useCurriculum } from "@/hooks/use-curriculum";
import { FOCUS_CARD_WIDTH, layerLabel, layoutFocus } from "@/lib/focus-layout";
import {
  describeUea,
  getDownstream,
  getUpstream,
  ueaById,
} from "@/lib/seriation";
import { cn } from "@/lib/utils";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Desktop view: only the seriation chain of one UEA, laid out in layers. */
export function FocusDiagram({ selectedId, onSelect }: Props) {
  const { statuses, recordMap, changeStatus } = useCurriculum();
  const [heights, setHeights] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const upstream = useMemo(() => getUpstream(selectedId), [selectedId]);
  const downstream = useMemo(() => getDownstream(selectedId), [selectedId]);
  const [available, setAvailable] = useState(0);
  const natural = useMemo(
    () => layoutFocus(selectedId, upstream, downstream, heights),
    [selectedId, upstream, downstream, heights],
  );
  // Fill the viewport height when there is room; shrink (down to 40%) when the
  // chain is taller than the screen, so the page never needs vertical scroll.
  const scale =
    available > 0 && natural.height > available
      ? Math.max(0.4, available / natural.height)
      : 1;
  const layout = useMemo(
    () =>
      available > natural.height
        ? layoutFocus(selectedId, upstream, downstream, heights, available)
        : natural,
    [available, natural, selectedId, upstream, downstream, heights],
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => {
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      setAvailable(Math.max(200, window.innerHeight - top - 110));
    };
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Card heights depend on their content (requirement notes wrap), so watch
  // them and lay out again whenever one changes.
  const nodeKey = layout.nodes.map((node) => node.id).join("|");
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      setHeights((current) => {
        const next = { ...current };
        let changed = false;
        for (const { target } of entries) {
          const el = target as HTMLElement;
          const id = el.dataset.ueaId as string;
          if (next[id] !== el.offsetHeight) {
            next[id] = el.offsetHeight;
            changed = true;
          }
        }
        return changed ? next : current;
      });
    });
    container
      .querySelectorAll("[data-uea-id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [nodeKey]);

  return (
    <div
      ref={wrapRef}
      className="mx-auto"
      style={{ width: layout.width * scale, height: layout.height * scale }}
    >
      <div
        ref={containerRef}
        className="relative origin-top-left"
        style={{
          width: layout.width,
          height: layout.height,
          transform: scale < 1 ? `scale(${scale})` : undefined,
        }}
      >
        {layout.labels.map(({ layer, x }) => (
          <div
            key={layer}
            className={cn(
              "absolute top-0 font-mono text-[11px] tracking-wider uppercase text-muted-foreground",
              layer === 0 && "text-foreground",
            )}
            style={{ left: x, width: FOCUS_CARD_WIDTH }}
          >
            {layerLabel(layer)}
          </div>
        ))}

        {layout.nodes.map(({ id, x, y }) => {
          const uea = ueaById.get(id);
          if (!uea) return null;
          return (
            <UeaNode
              key={id}
              view={describeUea(uea, statuses, recordMap)}
              selected={id === selectedId}
              showTrimester
              className="absolute"
              style={{ left: x, top: y, width: FOCUS_CARD_WIDTH }}
              onSelect={onSelect}
              onCycle={changeStatus}
            />
          );
        })}

        <svg
          width={layout.width}
          height={layout.height}
          className="pointer-events-none absolute top-0 left-0 z-[2] text-foreground"
          aria-hidden="true"
        >
          {layout.paths.map((path, i) => (
            <g key={i}>
              <path
                d={path.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeDasharray={path.dashed ? "5 4" : undefined}
              />
              <circle
                cx={path.end.x}
                cy={path.end.y}
                r="3.5"
                fill="currentColor"
              />
              <circle
                cx={path.start.x}
                cy={path.start.y}
                r="2.5"
                strokeWidth="1.5"
                stroke="currentColor"
                className="fill-card"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
