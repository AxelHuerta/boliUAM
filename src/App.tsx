import { ThemeProvider } from "./ThemeProvider";
import Navbar from "./components/ui/Navbar";
import UeaCard from "./components/ui/UeaCard";
import { trimesters } from "./content/ueas";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <main className=" flex flex-col">
        <h1 className="pt-36 text-center text-6xl font-extrabold">BoliUAM</h1>
        {trimesters.map((trimester, index) => {
          return (
            <div
              key={trimester[0].id + index}
              className="grid my-4 max-w-[1400px] mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {trimester.map((uea) => {
                return <UeaCard key={uea.id} uea={uea} />;
              })}
            </div>
          );
        })}
      </main>
    </ThemeProvider>
  );
}

export default App;
