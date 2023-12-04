import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  uea: Uea;
  approvedUeasID: string[];
};

type Actions = {
  setUea: (uea: Uea) => void;
  setApprovedUeasID: (ueas: string[]) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      uea: { name: "", id: "", credits: 0, trimestre: 0, seritation: [""] },
      approvedUeasID: [],
      setUea: (uea: Uea) =>
        set(() => ({
          uea,
        })),
      setApprovedUeasID: (ueas: string[]) =>
        set(() => ({
          ueas,
        })),
    }),
    { name: "ueas" },
  ),
);
