import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Uea {
  name: string;
  id: string;
  credits: number;
  trimestre: number;
}

type State = {
  uea: Uea;
};

type Actions = {
  setUea: (uea: Uea) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      uea: { name: "", id: "", credits: 0, trimestre: 0 },
      setUea: (uea: Uea) =>
        set(() => ({
          uea,
        })),
    }),
    { name: "approvedUeas" },
  ),
);
