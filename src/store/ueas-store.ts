import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Register {
  id: string;
  status: string;
  credits: number;
  register?: {
    id: string;
    name: string;
  };
}

interface UeaState {
  ueas: Register[];
  updateStatus: (uea: Register) => void;
  setUeas: (ueas: Register[]) => void;
}

function handleUpdateUeas(uea: Register, currentUeas: Register[]): Register[] {
  const existingIndex = currentUeas.findIndex((u) => u.id === uea.id);

  if (existingIndex !== -1) {
    const updatedUeas = [...currentUeas];
    updatedUeas[existingIndex] = uea;

    return updatedUeas;
  }

  return [...currentUeas, uea];
}

export const useUeaStore = create<UeaState>()(
  persist(
    (set) => ({
      ueas: [],
      updateStatus: (uea) =>
        set((state) => ({
          ueas: handleUpdateUeas(uea, state.ueas),
        })),
      setUeas: (ueas) => set({ ueas }),
    }),
    {
      name: "uea-storage",
    }
  )
);
