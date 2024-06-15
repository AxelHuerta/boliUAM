import { useEffect, useState } from "react";
import { useUeas } from "../store/Store";
import ConfettiExplosion from "react-confetti-explosion";

type Props = {
  name: string;
  id: string;
  credits: number;
  type: string;
  trimester: number;
  seriation: string[];
};

export default function Card(props: Readonly<Props>) {
  const { name, id, credits, type } = props;
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
      }, 4000);
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

  if (props.credits === -1) {
    return <div></div>;
  }

  return (
    <div
      className={`card w-80 sm:w-96 shadow-xl my-4 ${
        isApproved ? "bg-primary text-black" : "bg-neutral"
      }`}
    >
      <div className="card-body">
        {/* header */}
        <div className="flex justify-between items-center font-extrabold">
          <div>
            {/* id or clave */}
            <span className="text-gray-500">clave: </span>
            {id}
          </div>
          {/* copy button */}
          <button onClick={copyToClipboard}>
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* title */}
        <h2 className="card-title capitalize h-[100px] justify-center">
          {name}
        </h2>

        {/* credits and button */}
        {type.includes("optativa") ? null : (
          <div className="flex justify-between w-full px-2">
            <div className="font-extrabold">
              {/* credits */}
              <span className="text-gray-500">créditos</span>
              <p>{credits}</p>
            </div>
            <button
              className={`btn text-right btn-outline ${
                isApproved
                  ? "border border-black text-black hover:bg-transparent hover:border-black"
                  : "btn-primary"
              }`}
              onClick={handlerUeaState}
            >
              {isApproved ? "Desaprobar" : "Aprobar"}
            </button>
          </div>
        )}
      </div>

      {isApprovedForPushButton && (
        <ConfettiExplosion
          className="fixed left-0 top-0"
          width={5000}
          duration={1500}
        />
      )}
    </div>
  );
}
