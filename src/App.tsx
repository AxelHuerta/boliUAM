import { ModeToggle } from "./components/mode-toggle";
import { SEO } from "./components/seo";
import UeaCard from "./components/uea-card";
import UeaOptativaCard from "./components/uea-otativa-card";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { CategoryLegend } from "./components/category-legend";
import { SEOConfigs } from "./config/seo-config";
import { trimesters } from "./content/ueas";
import { useUeaStore } from "./store/ueas-store";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useFirestoreSync } from "./hooks/use-firestore-sync";
import { calculateProgress, getTotalCredits } from "./lib/progress-calc";
import { Github } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AppContent() {
  const { user, loading, logout, signInWithGithub } = useAuth();

  // Sync data with Firestore if user is logged in
  useFirestoreSync();

  const {
    approvedCredits,
    inProgressCredits,
    approvedCount,
    inProgressCount,
    totalCount,
    creditsPercentage,
  } = calculateProgress();

  const TOTAL_CREDITS = getTotalCredits();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      <SEO {...SEOConfigs.home} />
      {/* Theme-aware background pattern */}
      <div className="absolute inset-0 z-0 noise-pattern-bg" />
      <div className="relative z-10 mx-auto px-4 py-8">
        <header className="flex w-full justify-between items-center p-4">
          <div>
            <h1 className="text-3xl font-bold">BoliUAM</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Licenciatura en Computación
            </p>
            <span>UAM Iztapalapa</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                <span className="hidden md:block">Login with GitHub</span>
              </button>
            )}
            <ModeToggle />
          </div>
        </header>

        <main role="main">
          <section
            className="m-2 p-2"
            aria-label="Resumen de progreso académico"
          >
            <Card role="region" aria-labelledby="progress-summary">
              <CardHeader>
                <CardTitle id="progress-summary">
                  Progreso académico
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span
                      className="text-4xl font-bold"
                      aria-label={`${creditsPercentage.toFixed(
                        2,
                      )} por ciento de avance del plan`}
                    >
                      {creditsPercentage.toFixed(2)}%
                    </span>
                    <p className="text-sm text-muted-foreground">
                      avance del plan
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-sm">
                    <span
                      aria-label={`${approvedCredits} de ${TOTAL_CREDITS} créditos completados`}
                    >
                      <span className="font-semibold">{approvedCredits}</span> /{" "}
                      {TOTAL_CREDITS} créditos
                      {inProgressCredits > 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({inProgressCredits} en curso)
                        </span>
                      )}
                    </span>
                    <span
                      aria-label={`${approvedCount} de ${totalCount} materias completadas${
                        inProgressCount > 0
                          ? `, ${inProgressCount} en curso`
                          : ""
                      }`}
                    >
                      <span className="font-semibold">{approvedCount}</span> /{" "}
                      {totalCount} materias completadas
                      {inProgressCount > 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({inProgressCount} en curso)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Categorías de UEA
                  </p>
                  <CategoryLegend />
                </div>
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
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
