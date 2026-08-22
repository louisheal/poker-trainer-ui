import "./App.css";
import { AppSidebar } from "@/AppSidebar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { PreflopTrainer } from "@/preflopTrainer/PreflopTrainer";
import { DrawRanges } from "@/drawRanges/DrawRanges";

export type View = "ranges" | "preflop";

export const App = () => {
  const [view, setView] = useState<View>("ranges");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="h-svh">
        <AppSidebar view={view} setView={(view: View) => setView(view)} />
        <main className="w-full">
          {view === "ranges" && <DrawRanges />}
          {view === "preflop" && <PreflopTrainer />}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};
