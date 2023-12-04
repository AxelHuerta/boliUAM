import { Link } from "react-router-dom";
import { useUeas } from "../store/Store";

type Props = {
  name: string;
  id: string;
  credits: number;
  type: string;
  trimestre: number;
  seriation: string[];
};

export default function Card(props: Props) {
  const { setUea, approvedUeasID } = useUeas((state) => state);

  if (props.credits === -1) {
    return <div></div>;
  }

  return (
    <div
      className={`card w-80 sm:w-96 shadow-xl mx-auto my-4 ${
        approvedUeasID.includes(props.id)
          ? "bg-success text-black"
          : "bg-neutral"
      }`}
    >
      <div className="card-body">
        <h2 className="card-title capitalize">{props.name}</h2>
        <div className="grid grid-cols-2">
          {props.type.includes("optativa") ? null : (
            <>
              <p>Clave {props.id}</p>
              <p>Créditos {props.credits}</p>
            </>
          )}
        </div>
        <div className="card-actions justify-end">
          <Link
            to={`/ueas/${props.id}`}
            onClick={() =>
              setUea({
                name: props.name,
                id: props.id,
                credits: props.credits,
                trimestre: props.trimestre,
                seritation: props.seriation,
              })
            }
          >
            <button
              className={`btn ${
                approvedUeasID.includes(props.id)
                  ? "btn-neutral text-white"
                  : "btn-primary"
              }`}
            >
              Detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
