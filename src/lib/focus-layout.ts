import { allUeas, ueaById } from "@/lib/seriation";

export const FOCUS_CARD_WIDTH = 214;
const LAYER_GAP = 72;
const NODE_GAP = 12;
const TOP = 30;
const DUMMY_HEIGHT = 8;

export interface FocusNode {
  id: string;
  x: number;
  y: number;
}

export interface FocusPath {
  d: string;
  dashed: boolean;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface FocusLabel {
  x: number;
  layer: number;
}

export interface FocusLayout {
  nodes: FocusNode[];
  paths: FocusPath[];
  labels: FocusLabel[];
  width: number;
  height: number;
}

interface Edge {
  from: string;
  to: string;
  dashed: boolean;
}

/**
 * Layered layout of the seriation chain around one UEA: requirements on the
 * left, dependents on the right. Edges that skip layers are routed through
 * reserved slots so they never cross a card.
 */
export function layoutFocus(
  selectedId: string,
  upstream: Set<string>,
  downstream: Set<string>,
  heights: Record<string, number>,
  /** When the natural layout is shorter, spread the cards to fill this height. */
  targetHeight?: number,
): FocusLayout {
  const edges: Edge[] = [];
  for (const id of [...upstream, selectedId]) {
    for (const from of ueaById.get(id)?.seriation ?? []) {
      if (upstream.has(from)) edges.push({ from, to: id, dashed: false });
    }
  }
  for (const id of downstream) {
    for (const from of ueaById.get(id)?.seriation ?? []) {
      if (downstream.has(from) || from === selectedId) {
        edges.push({ from, to: id, dashed: true });
      }
    }
  }

  const layer: Record<string, number> = { [selectedId]: 0 };
  const distance: Record<string, number> = { [selectedId]: 0 };
  const distToSelected = (id: string): number => {
    if (id in distance) return distance[id];
    distance[id] = Math.max(
      ...edges.filter((e) => !e.dashed && e.from === id).map((e) => distToSelected(e.to) + 1),
    );
    return distance[id];
  };
  upstream.forEach((id) => (layer[id] = -distToSelected(id)));
  const layerOfDependent = (id: string): number => {
    if (id in layer) return layer[id];
    layer[id] = Math.max(
      ...edges.filter((e) => e.dashed && e.to === id).map((e) => layerOfDependent(e.from) + 1),
    );
    return layer[id];
  };
  downstream.forEach(layerOfDependent);

  const heightOf: Record<string, number> = {};
  const realIds = Object.keys(layer);
  realIds.forEach((id) => (heightOf[id] = heights[id] ?? 110));

  const chains = edges.map((edge) => {
    const ids = [edge.from];
    for (let k = layer[edge.from] + 1; k < layer[edge.to]; k++) {
      const dummy = `~${edge.from}>${edge.to}@${k}`;
      layer[dummy] = k;
      heightOf[dummy] = DUMMY_HEIGHT;
      ids.push(dummy);
    }
    ids.push(edge.to);
    return { ids, dashed: edge.dashed };
  });

  const neighbours: Record<string, string[]> = {};
  const connect = (a: string, b: string) => {
    (neighbours[a] ??= []).push(b);
    (neighbours[b] ??= []).push(a);
  };
  chains.forEach(({ ids }) => ids.slice(1).forEach((id, i) => connect(ids[i], id)));

  const layers: Record<number, string[]> = {};
  Object.keys(layer).forEach((id) => (layers[layer[id]] ??= []).push(id));
  const keys = Object.keys(layers).map(Number).sort((a, b) => a - b);
  const minLayer = keys[0];

  const sortKey = (id: string) => {
    const real = id.startsWith("~") ? id.slice(1).split(">")[0] : id;
    const uea = ueaById.get(real);
    return uea ? uea.trimester + allUeas.indexOf(uea) / 100 + (id.startsWith("~") ? 0.5 : 0) : 0;
  };
  keys.forEach((k) => layers[k].sort((a, b) => sortKey(a) - sortKey(b)));

  const top: Record<string, number> = {};
  const middle = (id: string) => top[id] + heightOf[id] / 2;
  keys.forEach((k) => {
    let y = 0;
    layers[k].forEach((id) => {
      top[id] = y;
      y += heightOf[id] + NODE_GAP;
    });
  });

  const order: Record<string, number> = {};
  const reindex = () => keys.forEach((k) => layers[k].forEach((id, i) => (order[id] = i)));
  reindex();
  for (let pass = 0; pass < 6; pass++) {
    const sequence = pass % 2 ? [...keys].reverse() : keys;
    for (const k of sequence) {
      const want: Record<string, number> = {};
      layers[k].forEach((id) => {
        const near = neighbours[id] ?? [];
        want[id] = near.length
          ? near.reduce((sum, n) => sum + middle(n), 0) / near.length - heightOf[id] / 2
          : top[id];
      });
      layers[k].sort((a, b) => want[a] - want[b] || order[a] - order[b]);
      let floor = -Infinity;
      let shift = 0;
      layers[k].forEach((id) => {
        top[id] = Math.max(want[id], floor);
        floor = top[id] + heightOf[id] + NODE_GAP;
        shift += want[id] - top[id];
      });
      shift /= layers[k].length;
      layers[k].forEach((id) => (top[id] += shift));
      floor = -Infinity;
      layers[k].forEach((id) => {
        top[id] = Math.max(top[id], floor);
        floor = top[id] + heightOf[id] + NODE_GAP;
      });
    }
    reindex();
  }

  const minTop = Math.min(...Object.values(top));
  Object.keys(top).forEach((id) => (top[id] += TOP - minTop));

  const bottom = () => Math.max(...Object.keys(top).map((id) => top[id] + heightOf[id])) + 12;
  let height = bottom();
  if (targetHeight && targetHeight > height) {
    const stretch = Math.min(2, (targetHeight - TOP - 12) / (height - TOP - 12));
    Object.keys(top).forEach((id) => (top[id] = TOP + (top[id] - TOP) * stretch));
    const leftover = targetHeight - bottom();
    Object.keys(top).forEach((id) => (top[id] += leftover / 2));
    height = targetHeight;
  }

  const xOf = (id: string) => (layer[id] - minLayer) * (FOCUS_CARD_WIDTH + LAYER_GAP);

  const paths: FocusPath[] = chains.map(({ ids, dashed }) => {
    const points: { x: number; y: number; straight?: boolean }[] = [];
    ids.forEach((id, i) => {
      const y = middle(id);
      if (i === 0) points.push({ x: xOf(id) + FOCUS_CARD_WIDTH, y });
      else if (i === ids.length - 1) points.push({ x: xOf(id), y });
      else {
        points.push({ x: xOf(id), y });
        points.push({ x: xOf(id) + FOCUS_CARD_WIDTH, y, straight: true });
      }
    });
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (b.straight) d += ` L${b.x},${b.y}`;
      else {
        const dx = (b.x - a.x) / 2;
        d += ` C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
      }
    }
    return { d, dashed, start: points[0], end: points[points.length - 1] };
  });

  return {
    nodes: realIds.map((id) => ({ id, x: xOf(id), y: top[id] })),
    paths,
    labels: keys.map((k) => ({ layer: k, x: (k - minLayer) * (FOCUS_CARD_WIDTH + LAYER_GAP) })),
    width: (keys.length - 1) * (FOCUS_CARD_WIDTH + LAYER_GAP) + FOCUS_CARD_WIDTH,
    height,
  };
}

export function layerLabel(layer: number): string {
  if (layer === 0) return "Seleccionada";
  if (layer === -1) return "Requisito directo";
  if (layer < 0) return `${-layer} pasos antes`;
  return layer === 1 ? "Se abre" : `${layer} pasos después`;
}
