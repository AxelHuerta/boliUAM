import type { UEA } from "@/interfaces/uea";
import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  CircleDashed,
  Clock,
  Copy,
  CopyCheck,
} from "lucide-react";
import { useUeaStore } from "@/store/ueas-store";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "./ui/badge";

interface Props {
  uea: UEA;
}

const statusValues = [
  { value: "pending", label: "Pendiente" },
  { value: "in-progress", label: "En curso" },
  { value: "approved", label: "¡Aprobada!" },
];

export default function UeaCard({ uea }: Props) {
  // Destructure the UEA properties
  const { id, name, credits } = uea;
  const ueas = useUeaStore((state) => state.ueas);

  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState(getStatus());

  const updatedUea = useUeaStore((state) => state.updateStatus);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setIsCopied(true);
      setInterval(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.log("Error copy to clipboard: ", error);
    }
  };

  function handleSelectChange(value: string) {
    updatedUea({
      id,
      status: value,
      credits,
    });

    setStatus(value);
  }

  function getStatus() {
    const ueaStatus = ueas.find((uea) => uea.id === id);
    return ueaStatus ? ueaStatus.status : "pending";
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={copyToClipboard}>
            {isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
          </Button>
          <p>
            Clave: <span className="font-bold">{id}</span>
          </p>
        </div>
        <Badge
          className=""
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
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl capitalize">{name}</CardTitle>
      </CardContent>
      <CardFooter className="flex-col">
        <div className="flex justify-between items-center w-full">
          <div>
            créditos: <span className="font-bold">{credits}</span>
          </div>
          <Select
            onValueChange={(value) => {
              handleSelectChange(value);
            }}
            defaultValue={status}
          >
            <SelectTrigger className="w-[180px]">
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
        </div>
      </CardFooter>
    </Card>
  );
}
