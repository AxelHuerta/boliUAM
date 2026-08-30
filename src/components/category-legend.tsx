import { categoryLabels, getCategoryColorVar } from "@/lib/category-colors";
import type { UeaCategory } from "@/lib/category-colors";

const categories = ["tronco", "computacion", "optativa", "proyecto"] as const;

export function CategoryLegend() {
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((category) => (
        <div key={category} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: getCategoryColorVar(category),
            }}
            aria-hidden="true"
          />
          <span className="text-sm text-foreground">
            {categoryLabels[category]}
          </span>
        </div>
      ))}
    </div>
  );
}
