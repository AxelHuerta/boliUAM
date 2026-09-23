import { useEffect, useState } from "react";
import { Github, LayoutPanelTop, Timer, X } from "lucide-react";
import { ModeToggle } from "./components/mode-toggle";
import { SEO } from "./components/seo";
import { NowView } from "./components/now-view";
import { PlanView, type PlanFilter } from "./components/plan-view";
import { ProgressSummary } from "./components/progress-summary";
import { Toaster } from "./components/toaster";
import { UeaDetail } from "./components/uea-detail";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent } from "./components/ui/dialog";
import { SEOConfigs } from "./config/seo-config";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useFirestoreSync } from "./hooks/use-firestore-sync";
import { useMediaQuery } from "./hooks/use-media-query";
import { cn } from "./lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type View = "now" | "plan";

const tabs = [
  { id: "now", label: "Ahora", Icon: Timer },
  { id: "plan", label: "Plan", Icon: LayoutPanelTop },
] as const;

function AppContent() {
  const { user, loading, logout, signInWithGithub } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [view, setView] = useState<View>("now");
  const [filter, setFilter] = useState<PlanFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync data with Firestore if user is logged in
  useFirestoreSync();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <SEO {...SEOConfigs.home} />
      <div className="mx-auto max-w-[1680px] px-4 pt-4 pb-24 lg:px-8 lg:pt-6 lg:pb-12">
        <header className="grid grid-cols-[1fr_auto] items-center gap-3.5 lg:grid-cols-[auto_1fr_auto_auto] lg:gap-6">
          <div className="lg:order-1">
            <h1 className="font-display text-[22px] leading-none font-bold tracking-tight">
              BoliUAM
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Lic. en Computación · UAM Iztapalapa
            </p>
          </div>

          <div className="flex items-center gap-4 lg:order-4">
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

          <ProgressSummary className="col-span-2 lg:col-span-1 lg:order-2" />

          <nav
            role="tablist"
            aria-label="Vista"
            className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2 border-t bg-card px-4 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))] lg:static lg:order-3 lg:grid-cols-[auto_auto] lg:gap-0.5 lg:rounded-xl lg:border lg:p-1"
          >
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-0.5 rounded-xl p-2 text-xs font-medium text-muted-foreground lg:flex-row lg:gap-1.5 lg:px-3.5 lg:py-[7px] lg:text-[13px]",
                  view === id && "bg-muted font-semibold text-foreground",
                )}
              >
                <Icon className="size-5 lg:size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        </header>

        <div className="mt-5 lg:mt-7 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-7">
          <main
            role="tabpanel"
            aria-label={view === "now" ? "Ahora" : "Plan de estudios"}
          >
            {view === "now" ? (
              <NowView
                selectedId={selectedId}
                onSelect={setSelectedId}
                onOpenPlan={(category) => {
                  setFilter(category);
                  setView("plan");
                  window.scrollTo({ top: 0 });
                }}
              />
            ) : (
              <PlanView
                selectedId={selectedId}
                filter={filter}
                onFilterChange={setFilter}
                onSelect={setSelectedId}
              />
            )}
          </main>

          {isDesktop ? (
            // contain-size: the panel never makes the row taller than the main column
            <div className="self-stretch contain-size">
              <aside
                aria-label="Detalle de la UEA"
                className="sticky top-5 max-h-[min(100%,calc(100dvh-40px))] overflow-auto rounded-2xl border bg-card p-[18px]"
              >
                {selectedId ? (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-0 right-0 z-10 rounded-full"
                      onClick={() => setSelectedId(null)}
                      aria-label="Cerrar detalle"
                    >
                      <X aria-hidden="true" />
                    </Button>
                    <UeaDetail id={selectedId} onSelect={setSelectedId} />
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <h2 className="font-display mb-1.5 text-lg font-bold text-foreground">
                      Seriación
                    </h2>
                    <p className="mb-2.5">
                      Elige una UEA para ver qué necesitas aprobar antes y qué
                      se abre cuando la apruebes.
                    </p>
                    <p>
                      En el plan, el mapa se reduce a esa cadena y atenúa el
                      resto.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <Dialog
              open={selectedId !== null}
              onOpenChange={(open) => !open && setSelectedId(null)}
            >
              <DialogContent
                aria-describedby={undefined}
                className="top-auto bottom-0 left-0 max-h-[86dvh] max-w-full translate-x-0 translate-y-0 gap-0 overflow-auto rounded-t-[20px] rounded-b-none p-[18px] pb-[calc(22px+env(safe-area-inset-bottom,0px))] data-[state=open]:slide-in-from-bottom sm:max-w-full"
              >
                {selectedId && (
                  <UeaDetail
                    id={selectedId}
                    asDialog
                    onSelect={setSelectedId}
                  />
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <Toaster />
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
