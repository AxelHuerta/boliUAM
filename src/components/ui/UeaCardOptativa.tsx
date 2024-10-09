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
import { Input } from "./input";

type Props = {
  uea: {
    id: string;
    uea: string;
    // TODO: Unnecessary
    credits: number;
    trimester: number;
    seriation: string[];
    type: string;
  };
};

function UeaCardOptativa(props: Readonly<Props>) {
  const { id, uea, credits } = props.uea;

  const {
    approvedUeas,
    setApprovedUeas,
    totalCredits,
    setTotalCredits,
    optativeUeas,
    setOptativeUeas,
  } = useUeas((state) => state);
  const [isCopied, setIsCopied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [optativeUea, setOptativeUea] = useState({
    id: "",
    uea: "",
    credits: 0,
  });

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
    const ueaTemp: OptativeUea | undefined = optativeUeas.find(
      (approvedUea) => approvedUea.storeTo === id
    );

    if (ueaTemp) {
      setOptativeUea({
        id: ueaTemp.id,
        uea: ueaTemp.uea,
        credits: ueaTemp.credits,
      });

      return true;
    }

    return false;
  };

  /**
   * Handler to change the state of the UEA.
   */
  const handlerUeaState = () => {
    if (!isApproved) {
      setApprovedUeas([...approvedUeas, id]);
      setTotalCredits(totalCredits + credits);
    } else {
      // TODO: refactor this
      const ueaTemp = optativeUeas.find(
        (approvedUea) => approvedUea.storeTo === id
      );
      setTotalCredits(totalCredits - Number(ueaTemp?.credits));
      setOptativeUeas(
        optativeUeas.filter((approvedUea) => approvedUea.storeTo !== id)
      );
    }

    setIsApproved(!isApproved);
  };

  const handleUeaData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptativeUea({ ...optativeUea, [name]: value });
  };

  const saveUeaData = () => {
    const ueaTemp = {
      id: optativeUea.id,
      uea: optativeUea.uea,
      credits: optativeUea.credits,
      storeTo: id,
    };

    setOptativeUeas([...optativeUeas, ueaTemp]);
    setTotalCredits(totalCredits + Number(optativeUea.credits));
    setIsApproved(true);
  };

  useEffect(() => {
    setIsApproved(checkIfUeaIsApproved());
  }, []);

  if (credits === -1) return <div></div>;

  // TODO: refactor this
  // TODO: add confetti explosion
  if (!isApproved) {
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
                      <label htmlFor="id" className="mr-2 text-lg w-[120px]">
                        Clave:
                      </label>
                      <Input
                        type="number"
                        name="id"
                        placeholder="1234567"
                        onChange={handleUeaData}
                      ></Input>
                    </div>
                    <div className="flex items-center my-4">
                      <label htmlFor="uea" className="mr-2 text-lg w-[120px]">
                        Nombre:
                      </label>
                      <Input
                        type="text"
                        name="uea"
                        placeholder="Temas Selectos de Ingeniería de Software"
                        onChange={handleUeaData}
                      ></Input>
                    </div>
                    <div className="flex items-center my-4">
                      <label
                        htmlFor="credits"
                        className="mr-2 text-lg w-[120px]"
                      >
                        Créditos:
                      </label>
                      <Input
                        type="number"
                        name="credits"
                        placeholder="11"
                        onChange={handleUeaData}
                      ></Input>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={saveUeaData}>Agregar UEA</Button>
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
    <Card className={`w-80 ${isApproved ? "border-2 border-green-600" : ""}`}>
      <CardHeader>
        <CardDescription className="flex justify-between items-center">
          <div>
            clave: <span className="font-bold">{optativeUea.id}</span>
          </div>
          <Button variant="ghost" onClick={copyToClipboard}>
            {isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[8em] flex items-center flex-col">
        <CardTitle className="capitalize">{optativeUea.uea}</CardTitle>
      </CardContent>

      <CardFooter>
        <CardDescription className="flex justify-between items-center w-full">
          <div>
            créditos: <span className="font-bold">{optativeUea.credits}</span>
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
  );
}

export default UeaCardOptativa;
