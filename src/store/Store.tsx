import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  approvedUeas: string[];
};

type Actions = {
  setApprovedUeas: (ueas: string[]) => void;
};

export const useUeas = create(
  persist<State & Actions>(
    (set) => ({
      approvedUeas: [],

      setApprovedUeas: (ueas: string[]) =>
        set(() => ({
          approvedUeas: ueas,
        })),
    }),
    { name: "ueasState" }
  )
);
