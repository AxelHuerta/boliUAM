import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  approvedUeas: string[];
  totalCredits: number;
  optativeUeas: OptativeUea[];
};

type Actions = {
  setApprovedUeas: (ueas: string[]) => void;
  setTotalCredits: (credits: number) => void;
  setOptativeUeas: (optatives: OptativeUea[]) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      approvedUeas: [],
      totalCredits: 0,
      optativeUeas: [],

      setApprovedUeas: (ueas: string[]) =>
        set(() => ({
          approvedUeas: ueas,
        })),
      setTotalCredits: (credits: number) =>
        set(() => ({
          totalCredits: credits,
        })),
      setOptativeUeas: (optatives: OptativeUea[]) =>
        set(() => ({
          optativeUeas: optatives,
        })),
    }),
    { name: "ueasState" }
  )
);
