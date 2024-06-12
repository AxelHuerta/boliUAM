import { useUeas } from "../store/Store";

type Props = {
  name: string;
  id: string;
  credits: number;
  type: string;
  trimestre: number;
  seriation: string[];
};

export default function Card(props: Readonly<Props>) {
  const { setUea, approvedUeasID } = useUeas((state) => state);

  if (props.credits === -1) {
    return <div></div>;
  }

  return (
    <div
      className={`card w-80 sm:w-96 shadow-xl my-4 ${
        approvedUeasID.includes(props.id)
          ? "bg-success text-black"
          : "bg-neutral"
      }`}
    >
      <div className="card-body">
        {/* header */}
        <div className="flex justify-between items-center font-extrabold">
          <div>
            <span className="text-gray-400">clave: </span>
            {props.id}
          </div>
          <span>copy</span>
        </div>

        {/* title */}
        <h2 className="card-title capitalize h-[100px] justify-center">{props.name}</h2>
        {props.type.includes("optativa") ? null : (
          <div className="flex justify-between w-full px-2">
            <div className="font-extrabold">
              <span className="text-gray-400">créditos</span>
              <p>{props.credits}</p>
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
