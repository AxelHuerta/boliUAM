import { ModeToggle } from "./components/mode-toggle";
import UeaCard from "./components/uea-card";
import UeaOptativaCard from "./components/uea-otativa-card";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { trimesters } from "./content/ueas";
import { useUeaStore } from "./store/ueas-store";
import { ThemeProvider } from "./theme-provider";

function App() {
  const ueasStore = useUeaStore((state) => state.ueas);

  let approvedCredits = 0;
  let inProgressCredits = 0;

  for (let i = 0; i < ueasStore.length; i++) {
    if (ueasStore[i].status === "approved") {
      approvedCredits += ueasStore[i].credits;
    } else if (ueasStore[i].status === "in-progress") {
      inProgressCredits += ueasStore[i].credits;
    }
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <header className="flex w-full justify-between items-center p-4">
        <h1 className="text-3xl font-bold">BoliUAM</h1>
        <ModeToggle />
      </header>
      <main>
        <section className="space-y-4 mx-2">
          {/* Créditos totales */}
          <Card>
            <CardHeader>
              <CardTitle>Créditos totales</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">477</CardContent>
          </Card>

          {/* Créditos completados */}
          <Card>
            <CardHeader>
              <CardTitle>Créditos completados</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {approvedCredits}
            </CardContent>
          </Card>

          {/* Créditos en curso */}
          <Card>
            <CardHeader>
              <CardTitle>Créditos en curso</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {inProgressCredits}
            </CardContent>
          </Card>
        </section>

        {trimesters.map((trimester) => (
          <section
            key={trimester[0].trimester}
            className="flex flex-col md:m-8"
          >
            <h2 className="text-2xl font-semibold m-4">
              Trimestre {trimester[0].trimester}
            </h2>
            <div className="flex flex-wrap gap-4 p-4 justify-center sm:justify-start">
              {trimester.map((uea) => {
                if (uea.id.includes("optativa")) {
                  return (
                    <UeaOptativaCard key={uea.id} id={uea.id} name={uea.name} />
                  );
                }

                return <UeaCard key={uea.id} uea={uea} />;
              })}
            </div>
          </section>
        ))}
      </main>
    </ThemeProvider>
  );
}

export default App;
