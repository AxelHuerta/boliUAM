import { useParams } from "react-router-dom";
import { useUeas } from "../store/Store";
import Navbar from "../components/Navbar";

export default function UeaDetails() {
  const { ueaId } = useParams();

  const { uea, approvedUeasID, setApprovedUeasID } = useUeas((state) => state);

  const approveUea = () => {
    approvedUeasID.push(uea.id);
    setApprovedUeasID(approvedUeasID);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl m-auto pt-12">
        <h1 className="uppercase text-2xl font-bold text-center m-12">
          {uea.name}
        </h1>
        <ul className="mx-4 bg-neutral px-4 py-8 rounded-md md:flex justify-between">
          <li className="flex justify-between">
            <span className="font-extrabold mr-2">Clave:</span>
            {ueaId}
          </li>
          <li className="flex justify-between">
            <span className="font-extrabold mr-2">Créditos:</span>
            {uea.credits}
          </li>
          <li className="flex justify-between">
            <span className="font-extrabold mr-2">Trimestre:</span>
            {uea.trimestre}
          </li>
          <li className="flex justify-between">
            <span className="font-extrabold mr-2">Seriación:</span>
            {uea.seritation.length > 0
              ? uea.seritation.toString()
              : "Esta UEA no esta seriada"}
          </li>
        </ul>
        <div className="m-4 bg-neutral px-4 py-8 rounded-md md:flex justify-around items-center">
          <p>¿Ya aprobaste esta materia?</p>
          <button className="btn btn-active btn-primary" onClick={approveUea}>
            Aprobar
          </button>
        </div>
      </div>
    </>
  );
}
