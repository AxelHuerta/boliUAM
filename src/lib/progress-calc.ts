import { useUeaStore } from "@/store/ueas-store";
import { trimesters } from "@/content/ueas";

export interface ProgressData {
  approvedCredits: number;
  inProgressCredits: number;
  approvedCount: number;
  inProgressCount: number;
  totalCount: number;
  creditsPercentage: number;
}

const TOTAL_CREDITS = 477;

export function calculateProgress(): ProgressData {
  const ueasStore = useUeaStore((state) => state.ueas);

  let approvedCredits = 0;
  let inProgressCredits = 0;
  let approvedCount = 0;
  let inProgressCount = 0;

  for (let i = 0; i < ueasStore.length; i++) {
    if (ueasStore[i].status === "approved") {
      approvedCredits += ueasStore[i].credits;
      approvedCount++;
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
  };
}

export function getTotalCredits(): number {
  return TOTAL_CREDITS;
}
