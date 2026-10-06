import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UEA } from "@/interfaces/uea";
import { useUeaStore } from "@/store/ueas-store";

const formSchema = z.object({
  registerId: z.string().length(7, {
    message: "La clave debe tener 7 caracteres.",
  }),
  registerName: z.string().min(1, {
    message: "Debe ingresar un nombre válido para la UEA.",
  }),
  registerCredits: z.number().min(1, {
    message: "Debe ingresar un valor válido de créditos.",
  }),
});

interface Props {
  uea: UEA;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Lets the student record which UEA they chose for an optativa slot. */
export function OptativaFormDialog({ uea, open, onOpenChange }: Props) {
  const record = useUeaStore((state) => state.ueas.find((r) => r.id === uea.id));
  const updateStatus = useUeaStore((state) => state.updateStatus);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      registerId: record?.register?.id ?? "",
      registerName: record?.register?.name ?? "",
      registerCredits: record?.credits ?? uea.credits,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateStatus({
      id: uea.id,
      status: record?.status ?? "pending",
      credits: values.registerCredits,
      register: { id: values.registerId, name: values.registerName },
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Datos de la UEA optativa</DialogTitle>
          <DialogDescription>
            Registra qué UEA cursas en este espacio del plan ({uea.name}).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="registerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UEA</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Temas Selectos de Ingeniería de Software" {...field} />
                  </FormControl>
                  <FormDescription>Nombre de la UEA</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="registerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clave</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 2151124" {...field} />
                    </FormControl>
                    <FormDescription>Clave asociada a la UEA</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registerCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ej. 11"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>Créditos asociados a la UEA</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
