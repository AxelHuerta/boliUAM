import { useUeas } from "../store/Store";

export default function Navbar() {
  const { totalCredits } = useUeas((state) => state);

  return (
    <div className="navbar bg-neutral fixed z-10 justify-between">
      BoliUAM
      <ul className="px-4">
        <li>Créditos: {totalCredits}</li>
      </ul>
    </div>
  );
}
