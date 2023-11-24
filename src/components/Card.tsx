type Props = {
  name: string;
  id: string;
  credits: number;
  type: string;
};

export default function Card(props: Props) {
  if (props.credits === -1) {
    return <div></div>;
  }

  return (
    <div className="card w-96 bg-neutral shadow-xl mx-auto my-4">
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
          <button className="btn btn-primary">Detalles</button>
        </div>
      </div>
    </div>
  );
}
