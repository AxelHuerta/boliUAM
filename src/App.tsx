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

  const creditsPercentage = (approvedCredits * 100) / 477;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full bg-black relative">
        {/* Dark Noise Colored Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
          }}
        />
        <div className="relative z-10 mx-auto px-4 py-8">
          {/* Your Content/Components */}
          <header className="flex w-full justify-between items-center p-4">
            <h1 className="text-3xl font-bold">BoliUAM</h1>
            <ModeToggle />
          </header>
          <main>
            <section className="m-2 p-2 space-y-4 sm:flex gap-4">
              {/* Créditos totales */}
              <Card className="w-full h-[160px]">
                <CardHeader>
                  <CardTitle>Créditos totales</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  477
                </CardContent>
              </Card>

              {/* Créditos completados */}
              <Card className="w-full h-[160px]">
                <CardHeader>
                  <CardTitle>Créditos completados</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  <p>{approvedCredits}</p>

                  <span className="text-sm ml-2">
                    {creditsPercentage.toFixed(2)}% del total
                  </span>
                </CardContent>
              </Card>

              {/* Créditos en curso */}
              <Card className="w-full h-[160px]">
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
                <div className="mx-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {trimester.map((uea) => {
                    if (uea.id.includes("optativa")) {
                      return (
                        <UeaOptativaCard
                          key={uea.id}
                          id={uea.id}
                          name={uea.name}
                        />
                      );
                    }

                    return <UeaCard key={uea.id} uea={uea} />;
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
