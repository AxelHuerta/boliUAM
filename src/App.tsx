import { ModeToggle } from "./components/mode-toggle";
import { SEO } from "./components/seo";
import UeaCard from "./components/uea-card";
import UeaOptativaCard from "./components/uea-otativa-card";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { SEOConfigs } from "./config/seo-config";
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

  const creditsPercentage = (approvedCredits * 100) / 477;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SEO {...SEOConfigs.home} />
      <div className="min-h-screen w-full relative">
        {/* Theme-aware background pattern */}
        <div className="absolute inset-0 z-0 noise-pattern-bg" />
        <div className="relative z-10 mx-auto px-4 py-8">
          <header className="flex w-full justify-between items-center p-4">
            <div>
              <h1 className="text-3xl font-bold">BoliUAM</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Boligrama - Licenciatura en Computación UAM Iztapalapa
              </p>
            </div>
            <ModeToggle />
          </header>

          <main role="main">
            <section
              className="m-2 p-2 space-y-4 sm:flex gap-4"
              aria-label="Resumen de créditos académicos"
            >
              {/* Créditos totales */}
              <Card
                className="w-full h-[160px]"
                role="region"
                aria-labelledby="total-credits"
              >
                <CardHeader>
                  <CardTitle id="total-credits">Créditos totales</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  <span aria-label="477 créditos totales de la carrera">
                    477
                  </span>
                </CardContent>
              </Card>

              {/* Créditos completados */}
              <Card
                className="w-full h-[160px]"
                role="region"
                aria-labelledby="completed-credits"
              >
                <CardHeader>
                  <CardTitle id="completed-credits">
                    Créditos completados
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  <p aria-label={`${approvedCredits} créditos completados`}>
                    {approvedCredits}
                  </p>

                  <span
                    className="text-sm ml-2"
                    aria-label={`${creditsPercentage.toFixed(
                      2
                    )} por ciento del total completado`}
                  >
                    {creditsPercentage.toFixed(2)}% del total
                  </span>
                </CardContent>
              </Card>

              {/* Créditos en curso */}
              <Card
                className="w-full h-[160px]"
                role="region"
                aria-labelledby="current-credits"
              >
                <CardHeader>
                  <CardTitle id="current-credits">Créditos en curso</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  <span
                    aria-label={`${inProgressCredits} créditos en curso actualmente`}
                  >
                    {inProgressCredits}
                  </span>
                </CardContent>
              </Card>
            </section>

            {trimesters.map((trimester) => (
              <section
                key={trimester[0].trimester}
                className="flex flex-col md:m-8"
                aria-labelledby={`trimester-${trimester[0].trimester}-heading`}
              >
                <h2
                  id={`trimester-${trimester[0].trimester}-heading`}
                  className="text-2xl font-semibold m-4"
                >
                  Trimestre {trimester[0].trimester}
                </h2>
                <div
                  className="mx-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  role="list"
                  aria-label={`Materias del trimestre ${trimester[0].trimester}`}
                >
                  {trimester.map((uea) => {
                    if (uea.id.includes("optativa")) {
                      return (
                        <div key={uea.id} role="listitem">
                          <UeaOptativaCard id={uea.id} name={uea.name} />
                        </div>
                      );
                    }

                    return (
                      <div key={uea.id} role="listitem">
                        <UeaCard uea={uea} />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
