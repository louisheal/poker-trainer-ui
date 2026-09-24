import "./App.css";
import { AppSidebar } from "@/AppSidebar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="h-svh">
        <AppSidebar />
        <main className="w-full">
          <div className="sticky top-0 z-10 border-b bg-background/90 p-2 backdrop-blur md:hidden">
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};
