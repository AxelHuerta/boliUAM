import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-neutral fixed z-10">
      <Link to={"/"} className="btn btn-ghost text-xl font-extrabold">
        BoliUAM
      </Link>
    </div>
  );
}
