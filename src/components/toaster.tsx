import { useNotify } from "@/lib/notify";

export function Toaster() {
  const message = useNotify((state) => state.message);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] z-[60] flex justify-center lg:bottom-7"
    >
      {message && (
        <p className="rounded-full bg-foreground px-3.5 py-2 text-center text-[13px] text-background shadow-lg">
          {message}
        </p>
      )}
    </div>
  );
}
