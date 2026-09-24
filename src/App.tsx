import "./App.css";
import { AppSidebar } from "@/AppSidebar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider className="h-svh">
        <AppSidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};
