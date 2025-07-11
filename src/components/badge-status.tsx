import { CircleCheckBig, CircleDashed, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

interface Props {
  status: string;
}

export default function BadgeStatus({ status }: Props) {
  return (
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
  );
}
