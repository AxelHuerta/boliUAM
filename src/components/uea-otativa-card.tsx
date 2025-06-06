import { CircleFadingPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  id: string;
  name: string;
}

export default function UeaOptativaCard({ id, name }: Props) {
  console.log(`Rendering UeaOptativaCard with id: ${id} and name: ${name}`);
  return (
    <Card className="w-full border-2 border-dashed border-neutral-500">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Agrega los datos de tu UEA optativa</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <CircleFadingPlus className="h-32 w-32 text-neutral-700" />
      </CardContent>
    </Card>
  );
}
