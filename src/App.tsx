import { AppSidebar } from "@/AppSidebar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DrawRanges } from "@/drawRanges/DrawRanges";

export const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SidebarProvider className="h-svh">
      <AppSidebar />
      <main className="w-full">
        <DrawRanges />
      </main>
    </SidebarProvider>
  </ThemeProvider>
);
