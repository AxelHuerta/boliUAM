export type UeaCategory = "tronco" | "computacion" | "optativa" | "proyecto";

export const categoryLabels: Record<UeaCategory, string> = {
  tronco: "Tronco",
  computacion: "Computación",
  optativa: "Optativa",
  proyecto: "Proyecto",
};

export function getCategoryColorVar(category: UeaCategory): string {
  return `var(--category-${category})`;
}

export function getTailwindColorClass(category: UeaCategory): string {
  const colorMap: Record<UeaCategory, string> = {
    tronco: "category-tronco",
    computacion: "category-computacion",
    optativa: "category-optativa",
    proyecto: "category-proyecto",
  };
  return colorMap[category];
}
