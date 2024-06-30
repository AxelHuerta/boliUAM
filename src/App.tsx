import { ThemeProvider } from "./ThemeProvider";
import Navbar from "./components/ui/Navbar";
import UeaCard from "./components/ui/UeaCard";
import { trimesters } from "./content/ueas";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <h1 className="pt-36 text-center text-6xl font-extrabold">BoliUAM</h1>
      {trimesters.map((trimester, index) => {
        return (
          <div
            key={trimester[0].id + index}
            className="grid grid-cols-4 my-4 max-w-[1400px] mx-auto"
          >
            {trimester.map((uea) => {
              return <UeaCard key={uea.id} uea={uea} />;
            })}
          </div>
        );
      })}
    </ThemeProvider>
  );
}

export default App;
