import {
  CircleCheckBig,
  CircleDashed,
  CircleFadingPlus,
  Clock,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUeaStore } from "@/store/ueas-store";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  registerId: z.string().length(7, {
    message: "La clave debe tener 7 caracteres.",
  }),
  registerName: z.string({
    required_error: "Debe ingresar un nombre.",
  }),
  registerCredits: z.number().min(1, {
    message: "Debe ingresar un valor válido de créditos.",
  }),
});

interface Props {
  id: string;
  name: string;
}

const statusValues = [
  { value: "pending", label: "Pendiente" },
  { value: "in-progress", label: "En curso" },
  { value: "approved", label: "¡Aprobada!" },
];

export default function UeaOptativaCard({ id, name }: Props) {
  const ueasStore = useUeaStore((state) => state.ueas);
  const updateStatus = useUeaStore((state) => state.updateStatus);

  const registeredUea = ueasStore.find((uea) => uea.id === id);

  const [status, setStatus] = useState(getStatus());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registerId: registeredUea ? registeredUea.register?.id : "",
      registerName: registeredUea ? registeredUea.register?.name : "",
      registerCredits: registeredUea ? registeredUea.credits : undefined,
    },
  });

  function handleSelectChange(value: string) {
    updateStatus({
      id,
      status: value,
      credits: registeredUea ? registeredUea.credits : 0,
      register: {
        id: registeredUea?.register ? registeredUea.register.id : "",
        name: registeredUea?.register ? registeredUea?.register.name : "",
      },
    });

    setStatus(value);
  }

  function getStatus() {
    return registeredUea ? registeredUea.status : "pending";
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newUea = {
      id,
      status: "pending",
      credits: values.registerCredits,
      register: {
        id: values.registerId,
        name: values.registerName,
      },
    };

    updateStatus(newUea);
  }

  if (ueasStore.some((uea) => uea.id === id)) {
    const uea = ueasStore.find((uea) => uea.id === id);
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{uea?.register?.name}</CardTitle>
              <CardDescription>{name}</CardDescription>
            </div>
            <Badge
              variant={
                status === "pending"
                  ? "outline"
                  : status === "in-progress"
                  ? "secondary"
                  : "default"
              }
            >
              {status === "pending" && (
                <>
                  <CircleDashed />
                  <span>Pendiente</span>
                </>
              )}
              {status === "in-progress" && (
                <>
                  <Clock />
                  <span> En curso</span>
                </>
              )}
              {status === "approved" && (
                <>
                  <CircleCheckBig />
                  <span>¡Aprobada!</span>
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p>
              Créditos: <span>{uea?.credits}</span>
            </p>
            {/* Dialog */}
            <Dialog>
              <DialogTrigger>
                <Edit className="h-6 w-6 cursor-pointer" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">
                    Ingresa los datos de la UEA optativa
                  </DialogTitle>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {/* name */}
                      <FormField
                        control={form.control}
                        name="registerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UEA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. Temas Selectos de Ingeniería de Software"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Nombre de la UEA</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        {/* id */}
                        <FormField
                          control={form.control}
                          name="registerId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clave</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej. 2151124" {...field} />
                              </FormControl>
                              <FormDescription>
                                Clave asociada a la UEA
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* credits */}
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
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Créditos asociados a la UEA
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <DialogClose asChild about="">
                          <Button type="submit">Registrar</Button>
                        </DialogClose>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <Select
            onValueChange={(value) => {
              handleSelectChange(value);
            }}
            defaultValue={status}
          >
            <SelectTrigger className="w-full my-4">
              <SelectValue placeholder="Estado de la UEA" />
            </SelectTrigger>
            <SelectContent>
              {statusValues.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-2 border-dashed border-neutral-500">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Agrega los datos de tu UEA optativa</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {/* Dialog */}
        <Dialog>
          <DialogTrigger>
            <CircleFadingPlus className="h-32 w-32 text-neutral-700 cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">
                Ingresa los datos de la UEA optativa
              </DialogTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="registerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UEA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Temas Selectos de Ingeniería de Software"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Nombre de la UEA</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    {/* id */}
                    <FormField
                      control={form.control}
                      name="registerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clave</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej. 2151124" {...field} />
                          </FormControl>
                          <FormDescription>
                            Clave asociada a la UEA
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* credits */}
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
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Créditos asociados a la UEA
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Registrar</Button>
                  </div>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
