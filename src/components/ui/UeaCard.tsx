import { Button } from "./button";
import { useUeas } from "../../store/Store";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Copy, CopyCheck } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";

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
  const { id, uea, credits } = props.uea;
  const { approvedUeas, setApprovedUeas, totalCredits, setTotalCredits } =
    useUeas((state) => state);
  const [isCopied, setIsCopied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isApprovedForPushButton, setIsApprovedForPushButton] = useState(false);

  /**
   * Copy 'clave' (id) to clipboard.
   */
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

  /**
   * Chech if the UEA is already approved.
   */
  const checkIfUeaIsApproved = () => {
    return approvedUeas.includes(id);
  };

  /**
   * Handler to change the state of the UEA.
   */
  const handlerUeaState = () => {
    if (!isApproved) {
      setApprovedUeas([...approvedUeas, id]);
      setTotalCredits(totalCredits + credits);
      setIsApprovedForPushButton(true);
    } else {
      // TODO: refactor this
      setApprovedUeas(approvedUeas.filter((approvedUea) => approvedUea !== id));
      setTotalCredits(totalCredits - credits);
      setIsApprovedForPushButton(false);
    }

    setIsApproved(!isApproved);
  };

  useEffect(() => {
    setIsApproved(checkIfUeaIsApproved());
  }, []);

  if (credits === -1) return <div></div>;

  return (
    <>
      <Card className={`w-80 ${isApproved ? "border-2 border-green-600" : ""}`}>
        <CardHeader>
          <CardDescription className="flex justify-between items-center">
            <div>
              clave: <span className="font-bold">{id}</span>
            </div>
            <Button variant="ghost" onClick={copyToClipboard}>
              {isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
            </Button>
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[8em] flex items-center">
          <CardTitle className="capitalize">{uea}</CardTitle>
        </CardContent>

        <CardFooter>
          <CardDescription className="flex justify-between items-center w-full">
            <div>
              créditos: <span className="font-bold">{credits}</span>
            </div>
            <div>
              <Button
                variant={isApproved ? "secondary" : "default"}
                onClick={handlerUeaState}
              >
                {isApproved ? "Desaprobar" : "Aprobar"}
              </Button>
            </div>
          </CardDescription>
        </CardFooter>
      </Card>

      {/* Confetti explotion */}
      {isApprovedForPushButton && (
        <ConfettiExplosion
          className="fixed left-0 top-0"
          width={5000}
          duration={1500}
        />
      )}
    </>
  );
}

export default UeaCard;
