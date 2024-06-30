import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type Props = {
  uea: {
    id: string;
    uea: string;
    credits: number;
    trimester: number;
    seriation: string[];
    type: string;
  };
};

function UeaCard(props: Readonly<Props>) {
  const { uea } = props;

  if (uea.credits === -1) return <div></div>;

  return (
    <Card className="w-80">
      <CardHeader>
        <CardDescription className="flex justify-between">
          <div>clave:{uea.id}</div>
          <div>Copy</div>
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[8em] flex items-center">
        <CardTitle className="capitalize">{uea.uea}</CardTitle>
      </CardContent>

      <CardFooter>
        <CardDescription className="flex justify-between w-full">
          <div>créditos: {uea.credits}</div>
          <div>
            <Button>Aprobar</Button>
          </div>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

export default UeaCard;
