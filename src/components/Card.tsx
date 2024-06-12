import { useState } from "react";
import { useUeas } from "../store/Store";

type Props = {
  name: string;
  id: string;
  credits: number;
  type: string;
  trimester: number;
  seriation: string[];
};

export default function Card(props: Readonly<Props>) {
  const { name, id, credits, type, trimester, seriation } = props;
  const { setUea, approvedUeasID } = useUeas((state) => state);
  const [isCopied, setIsCopied] = useState(false);

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

  if (props.credits === -1) {
    return <div></div>;
  }

  return (
    <div
      className={`card w-80 sm:w-96 shadow-xl my-4 ${
        approvedUeasID.includes(id) ? "bg-success text-black" : "bg-neutral"
      }`}
    >
      <div className="card-body">
        {/* header */}
        <div className="flex justify-between items-center font-extrabold">
          <div>
            <span className="text-gray-400">clave: </span>
            {id}
          </div>
          <button onClick={copyToClipboard}>
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* title */}
        <h2 className="card-title capitalize h-[100px] justify-center">
          {name}
        </h2>
        {type.includes("optativa") ? null : (
          <div className="flex justify-between w-full px-2">
            <div className="font-extrabold">
              <span className="text-gray-400">créditos</span>
              <p>{credits}</p>
            </div>
            <button className="btn btn-primary btn-outline text-right">
              Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
