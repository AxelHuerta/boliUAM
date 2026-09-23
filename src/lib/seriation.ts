import { trimesters } from "@/content/ueas";
import type { UEA } from "@/interfaces/uea";
import type { Register } from "@/store/ueas-store";
import type { UeaCategory } from "@/lib/category-colors";

export type UeaStatus = "pending" | "in-progress" | "approved";
export type NodeState = "locked" | "available" | "in-progress" | "approved";
export type ActiveStatus = Exclude<UeaStatus, "pending">;
/** Only started UEAs appear here; absent means pending. */
export type StatusMap = ReadonlyMap<string, ActiveStatus>;
export type RecordMap = ReadonlyMap<string, Register>;

export const allUeas: UEA[] = trimesters.flat();
export const ueaById: ReadonlyMap<string, UEA> = new Map(
  allUeas.map((uea) => [uea.id, uea]),
);
export const trimesterNumbers: number[] = [
  ...new Set(allUeas.map((uea) => uea.trimester)),
];

const dependentsById = new Map<string, string[]>();
for (const uea of allUeas) {
  for (const requiredId of uea.seriation) {
    const list = dependentsById.get(requiredId) ?? [];
    list.push(uea.id);
    dependentsById.set(requiredId, list);
  }
}

export const categoryOf = (uea: UEA) => uea.type as UeaCategory;

export function buildStatusMap(records: Register[]): StatusMap {
  const map = new Map<string, ActiveStatus>();
  for (const record of records) {
    if (record.status === "approved" || record.status === "in-progress") {
      map.set(record.id, record.status);
    }
  }
  return map;
}

export function buildRecordMap(records: Register[]): RecordMap {
  return new Map(records.map((record) => [record.id, record]));
}

export const getDependents = (id: string): string[] =>
  dependentsById.get(id) ?? [];

/** Ids of the requirements that are not approved yet. */
export function unmetRequirements(uea: UEA, statuses: StatusMap): string[] {
  return uea.seriation.filter((id) => statuses.get(id) !== "approved");
}

export function getNodeState(uea: UEA, statuses: StatusMap): NodeState {
  const status = statuses.get(uea.id);
  if (status) return status;
  return unmetRequirements(uea, statuses).length ? "locked" : "available";
}

function walk(id: string, next: (id: string) => string[]): Set<string> {
  const seen = new Set<string>();
  const queue = [id];
  while (queue.length) {
    for (const nextId of next(queue.pop() as string)) {
      if (!seen.has(nextId)) {
        seen.add(nextId);
        queue.push(nextId);
      }
    }
  }
  return seen;
}

/** Every UEA that must be approved (transitively) before this one. */
export const getUpstream = (id: string) =>
  walk(id, (current) => ueaById.get(current)?.seriation ?? []);

/** Every UEA that this one (transitively) unlocks. */
export const getDownstream = (id: string) => walk(id, getDependents);

export interface UeaView {
  uea: UEA;
  state: NodeState;
  name: string;
  credits: number;
  clave: string;
  unmet: { uea: UEA; status: UeaStatus }[];
}

/** Optativas take name, clave and credits from the student's own registration. */
export function describeUea(
  uea: UEA,
  statuses: StatusMap,
  records: RecordMap,
): UeaView {
  const record = records.get(uea.id);
  const isOptativa = uea.type === "optativa";
  const clave = /^\d/.test(uea.id)
    ? uea.id
    : (record?.register?.id ?? "sin clave");
  return {
    uea,
    state: getNodeState(uea, statuses),
    name: capitalize(
      isOptativa && record?.register?.name ? record.register.name : uea.name,
    ),
    credits: record?.credits ?? uea.credits,
    clave,
    unmet: unmetRequirements(uea, statuses).flatMap((id) => {
      const required = ueaById.get(id);
      return required ? [{ uea: required, status: statuses.get(id) ?? "pending" }] : [];
    }),
  };
}

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

function withStatus(
  list: Register[],
  uea: UEA,
  status: UeaStatus,
): Register[] {
  const existing = list.find((record) => record.id === uea.id);
  if (status === "pending" && !existing?.register) {
    return list.filter((record) => record.id !== uea.id);
  }
  const next: Register = {
    id: uea.id,
    status,
    credits: existing?.credits ?? uea.credits,
    ...(existing?.register ? { register: existing.register } : {}),
  };
  return existing
    ? list.map((record) => (record.id === uea.id ? next : record))
    : [...list, next];
}

export interface StatusChange {
  ueas: Register[];
  /** UEAs sent back to pending because a requirement stopped being approved. */
  reset: UEA[];
}

/**
 * Applies a status change respecting seriation. Returns null when the UEA is
 * locked. Un-approving a UEA resets every dependent that was already started.
 */
export function applyStatus(
  records: Register[],
  uea: UEA,
  status: UeaStatus,
): StatusChange | null {
  const statuses = buildStatusMap(records);
  const previous = statuses.get(uea.id) ?? "pending";
  if (status !== "pending" && unmetRequirements(uea, statuses).length) {
    return null;
  }

  let next = withStatus(records, uea, status);
  const reset: UEA[] = [];
  if (previous === "approved" && status !== "approved") {
    for (const id of getDownstream(uea.id)) {
      const dependent = ueaById.get(id);
      if (dependent && statuses.has(id)) {
        next = withStatus(next, dependent, "pending");
        reset.push(dependent);
      }
    }
  }
  return { ueas: next, reset };
}

export const nextStatus = (state: NodeState): UeaStatus =>
  state === "available"
    ? "in-progress"
    : state === "in-progress"
      ? "approved"
      : "pending";
