import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  uea: Uea;
  credits: number;
  approvedUeasID: string[];
};

type Actions = {
  setUea: (uea: Uea) => void;
  setCredits: (credits: number) => void;
  setApprovedUeasID: (ueas: string[]) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      uea: { name: "", id: "", credits: 0, trimestre: 0, seritation: [""] },
      credits: 0,
      approvedUeasID: [],
      setUea: (uea: Uea) =>
        set(() => ({
          uea,
        })),
      setApprovedUeasID: (ueas: string[]) =>
        set(() => ({
          approvedUeasID: ueas,
        })),
      setCredits: (credits: number) =>
        set(() => ({
          credits,
        })),
    }),
    { name: "ueasState" },
  ),
);
