import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  approvedUeas: string[];
  totalCredits: number;
};

type Actions = {
  setApprovedUeas: (ueas: string[]) => void;
  setTotalCredits: (credits: number) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      approvedUeas: [],
      totalCredits: 0,

      setApprovedUeas: (ueas: string[]) =>
        set(() => ({
          approvedUeas: ueas,
        })),
      setTotalCredits: (credits: number) =>
        set(() => ({
          totalCredits: credits,
        })),
    }),
    { name: "ueasState" }
  )
);
