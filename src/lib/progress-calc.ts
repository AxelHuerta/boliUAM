import { useUeaStore } from "@/store/ueas-store";
import { trimesters } from "@/content/ueas";
import type { UeaCategory } from "@/lib/category-colors";
import { categoryOf, ueaById } from "@/lib/seriation";

export interface ProgressData {
  approvedCredits: number;
  inProgressCredits: number;
  approvedCount: number;
  inProgressCount: number;
  totalCount: number;
  creditsPercentage: number;
  approvedByCategory: Partial<Record<UeaCategory, number>>;
}

const TOTAL_CREDITS = 477;

export function useProgress(): ProgressData {
  const ueasStore = useUeaStore((state) => state.ueas);

  let approvedCredits = 0;
  let inProgressCredits = 0;
  let approvedCount = 0;
  let inProgressCount = 0;
  const approvedByCategory: Partial<Record<UeaCategory, number>> = {};

  for (let i = 0; i < ueasStore.length; i++) {
    if (ueasStore[i].status === "approved") {
      approvedCredits += ueasStore[i].credits;
      approvedCount++;
      const uea = ueaById.get(ueasStore[i].id);
      if (uea) {
        const category = categoryOf(uea);
        approvedByCategory[category] =
          (approvedByCategory[category] ?? 0) + ueasStore[i].credits;
      }
    } else if (ueasStore[i].status === "in-progress") {
      inProgressCredits += ueasStore[i].credits;
      inProgressCount++;
    }
  }

  const totalCount = trimesters.flat().length;
  const creditsPercentage = (approvedCredits * 100) / TOTAL_CREDITS;

  return {
    approvedCredits,
    inProgressCredits,
    approvedCount,
    inProgressCount,
    totalCount,
    creditsPercentage,
    approvedByCategory,
  };
}

export function getTotalCredits(): number {
  return TOTAL_CREDITS;
}
