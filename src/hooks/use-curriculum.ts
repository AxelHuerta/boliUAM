import { useCallback, useMemo } from "react";
import type { UEA } from "@/interfaces/uea";
import { useNotify } from "@/lib/notify";
import {
  applyStatus,
  buildRecordMap,
  buildStatusMap,
  type UeaStatus,
} from "@/lib/seriation";
import { useUeaStore } from "@/store/ueas-store";

/** Student progress derived from the store, plus a seriation-aware status setter. */
export function useCurriculum() {
  const records = useUeaStore((state) => state.ueas);
  const setUeas = useUeaStore((state) => state.setUeas);
  const notify = useNotify((state) => state.show);

  const statuses = useMemo(() => buildStatusMap(records), [records]);
  const recordMap = useMemo(() => buildRecordMap(records), [records]);

  const changeStatus = useCallback(
    (uea: UEA, status: UeaStatus) => {
      const change = applyStatus(useUeaStore.getState().ueas, uea, status);
      if (!change) return;
      setUeas(change.ueas);
      if (change.reset.length) {
        notify(
          change.reset.length === 1
            ? "1 UEA volvió a pendiente: dependía de la que reiniciaste"
            : `${change.reset.length} UEAs volvieron a pendiente: dependían de la que reiniciaste`,
        );
      }
    },
    [setUeas, notify],
  );

  return { records, statuses, recordMap, changeStatus };
}
