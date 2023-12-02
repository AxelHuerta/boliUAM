import { useParams } from "react-router-dom";
import { useUeas } from "../store/Store";

export default function UeaDetails() {
  const { ueaId } = useParams();

  const { uea } = useUeas((state) => state);

  return (
    <>
      <h1 className="capitalize text-2xl font-bold text-center my-4">
        {uea.name}
      </h1>
      <ul className="mx-4">
        <li>
          <span className="font-bold mr-2">Clave:</span>
          {ueaId}
        </li>
        <li>
          <span className="font-bold mr-2">Créditos:</span>
          {uea.credits}
        </li>
        <li>
          <span className="font-bold mr-2">Trimestre:</span>
          {uea.trimestre}
        </li>
      </ul>
    </>
  );
}
