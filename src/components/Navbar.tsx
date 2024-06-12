import { Link } from "react-router-dom";

// TODO: Add functionality to show the credits
export default function Navbar() {
  // const { credits } = useUeas((state) => state);

  return (
    <div className="navbar bg-neutral fixed z-10 justify-between">
      <Link to={"/"} className="btn btn-ghost text-xl font-extrabold">
        BoliUAM
      </Link>
      <ul className="px-4">
        <li>Créditos: {}</li>
      </ul>
    </div>
  );
}
