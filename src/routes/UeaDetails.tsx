import { useParams } from "react-router-dom";

export default function UeaDetails() {
  const { ueaId } = useParams();

  const name = "cursos complementarios";
  const credits = 26;
  const trimestre = 0;

  return (
    <>
      <h1 className="capitalize text-2xl font-bold text-center my-4">{name}</h1>
      <ul className="mx-4">
        <li>
          <span className="font-bold mr-2">Clave:</span>
          {ueaId}
        </li>
        <li>
          <span className="font-bold mr-2">Créditos:</span>
          {credits}
        </li>
        <li>
          <span className="font-bold mr-2">Trimestre:</span>
          {trimestre}
        </li>
      </ul>
    </>
  );
}
