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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import { Copy, CopyCheck } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { Input } from "./input";

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

function UeaCardOptativa(props: Readonly<Props>) {
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

  // TODO: refactor this
  if (true) {
    return (
      <Card className={`w-80 ${isApproved ? "border-2 border-green-600" : ""}`}>
        <CardHeader>
          <CardDescription className="flex justify-between items-center">
            Agrega los datos de la UEA que hayas inscrito.
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[8em] flex items-center">
          <CardTitle className="capitalize">{uea}</CardTitle>
        </CardContent>

        <CardFooter>
          <CardDescription className="flex justify-end items-center w-full">
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Agregar UEA</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {/* TODO: add optative type */}
                  <DialogTitle className="mb-4">UEA {uea}</DialogTitle>
                  <DialogDescription>
                    <div className="flex items-center my-4">
                      <label className="mr-2 text-lg w-[120px]">Clave:</label>
                      <Input type="number" placeholder="1234567"></Input>
                    </div>
                    <div className="flex items-center my-4">
                      <label className="mr-2 text-lg w-[120px]">Nombre:</label>
                      <Input
                        type="text"
                        placeholder="Temas Selectos de Ingeniería de Software"
                      ></Input>
                    </div>
                    <div className="flex items-center my-4">
                      <label className="mr-2 text-lg w-[120px]">
                        Créditos:
                      </label>
                      <Input type="number" placeholder="11"></Input>
                    </div>
                    <div className="flex justify-end">
                      <Button>Agregar UEA</Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardDescription>
        </CardFooter>
      </Card>
    );
  }

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

export default UeaCardOptativa;
