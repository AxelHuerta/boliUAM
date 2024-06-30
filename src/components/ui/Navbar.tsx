import { ModeToggle } from "./ModeToggle";

function Navbar() {
  return (
    <nav className="fixed flex justify-between items-center py-2 px-12 w-full bg-white dark:bg-card shadow-md">
      <span className="font-extrabold text-xl">BoliUAM</span>
      <div className="flex items-center gap-4">
        <ul>
          {/* TODO: add credits functionality */}
          <li>Créditos: 0</li>
        </ul>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
