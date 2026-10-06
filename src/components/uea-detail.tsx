import { useState } from "react";
import { Copy, CopyCheck, Lock, Pencil } from "lucide-react";
import { OptativaFormDialog } from "@/components/optativa-form-dialog";
import { StatusIcon, stateLabels } from "@/components/status-icon";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { useCurriculum } from "@/hooks/use-curriculum";
import { categoryLabels } from "@/lib/category-colors";
import {
  categoryOf,
  describeUea,
  getDependents,
  getUpstream,
  ueaById,
  type UeaStatus,
} from "@/lib/seriation";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  /** Rendered inside a Radix dialog (mobile sheet), which needs a DialogTitle. */
  asDialog?: boolean;
  onSelect: (id: string) => void;
}

const statusOptions: { value: UeaStatus; label: string; icon: "available" | "in-progress" | "approved" }[] = [
  { value: "pending", label: "Pendiente", icon: "available" },
  { value: "in-progress", label: "En curso", icon: "in-progress" },
  { value: "approved", label: "Aprobada", icon: "approved" },
];

export function UeaDetail({ id, asDialog, onSelect }: Props) {
  const { statuses, recordMap, changeStatus } = useCurriculum();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const uea = ueaById.get(id);
  if (!uea) return null;

  const view = describeUea(uea, statuses, recordMap);
  const locked = view.state === "locked";
  const missing = [...getUpstream(id)].filter((up) => statuses.get(up) !== "approved").length;
  const dependents = getDependents(id);
  const current: UeaStatus = statuses.get(id) ?? "pending";
  const Title = asDialog ? DialogTitle : "h2";

  async function copyClave() {
    try {
      await navigator.clipboard.writeText(view.clave);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }

  const relation = (relatedId: string) => {
    const related = ueaById.get(relatedId);
    if (!related) return null;
    const relatedView = describeUea(related, statuses, recordMap);
    return (
      <li key={relatedId}>
        <button
          type="button"
          onClick={() => onSelect(relatedId)}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left hover:border-foreground"
        >
          <StatusIcon state={relatedView.state === "locked" ? "lock" : relatedView.state} className="size-[18px]" />
          <span>{relatedView.name}</span>
          <span className="ml-auto text-xs whitespace-nowrap text-muted-foreground">{stateLabels[relatedView.state]}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span
            className="size-[9px] rounded-[3px]"
            style={{ backgroundColor: `var(--category-${categoryOf(uea)})` }}
            aria-hidden="true"
          />
          {categoryLabels[categoryOf(uea)]} · {view.clave}
          <Button variant="ghost" size="icon" className="size-6" onClick={copyClave} aria-label="Copiar clave">
            {copied ? <CopyCheck className="size-3.5" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
        <Title className="font-display pr-8 text-[26px] leading-[1.1] font-bold tracking-tight text-balance">
          {view.name}
        </Title>
      </div>

      <dl className="my-3 flex gap-[18px] text-[12.5px] text-muted-foreground tabular-nums">
        {[
          [view.credits, "créditos"],
          [`T${uea.trimester}`, "trimestre"],
          [dependents.length, "abre"],
        ].map(([value, label]) => (
          <div key={label} className="flex flex-col">
            <dd className="font-display order-first text-xl leading-tight font-bold text-foreground">{value}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>

      {locked && (
        <div className="mb-1.5 flex gap-2.5 rounded-[10px] bg-muted px-3 py-2.5 text-[13px]" role="note">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <b className="font-semibold">Aún no puedes cursarla.</b>{" "}
            {missing === 1 ? "Te falta 1 UEA" : `Te faltan ${missing} UEAs`} en su cadena de seriación.
          </span>
        </div>
      )}

      <div role="group" aria-label="Estado de la UEA" className="mt-3.5 mb-2 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={locked}
            aria-pressed={current === option.value}
            onClick={() => changeStatus(uea, option.value)}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1 rounded-[9px] px-1.5 py-2.5 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-40",
              current === option.value && "bg-card font-semibold shadow-sm",
            )}
          >
            <StatusIcon state={option.icon} />
            {option.label}
          </button>
        ))}
      </div>

      {uea.type === "optativa" && (
        <>
          <Button variant="outline" size="sm" className="mt-1 self-start" onClick={() => setEditing(true)}>
            <Pencil aria-hidden="true" />
            {recordMap.get(id)?.register ? "Editar datos de la UEA" : "Elegir UEA"}
          </Button>
          <OptativaFormDialog uea={uea} open={editing} onOpenChange={setEditing} />
        </>
      )}

      <section className="mt-4" aria-labelledby="detail-requires">
        <h3 id="detail-requires" className="mb-1.5 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Requiere aprobar
        </h3>
        {uea.seriation.length ? (
          <ul className="grid gap-1">{uea.seriation.map(relation)}</ul>
        ) : (
          <p className="text-[13px] text-muted-foreground">Sin seriación: puedes cursarla en cualquier momento.</p>
        )}
      </section>

      <section className="mt-4" aria-labelledby="detail-opens">
        <h3 id="detail-opens" className="mb-1.5 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Al aprobarla se abre
        </h3>
        {dependents.length ? (
          <ul className="grid gap-1">{dependents.map(relation)}</ul>
        ) : (
          <p className="text-[13px] text-muted-foreground">No es requisito de ninguna otra UEA.</p>
        )}
      </section>
    </div>
  );
}
