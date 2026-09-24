import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Dices, Grid2X2Check } from "lucide-react";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exercises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/ranges" || pathname === "/"}
                  onClick={() => navigate({ to: "/ranges" })}
                >
                  <Grid2X2Check />
                  <span>Draw Ranges</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/preflop"}
                  onClick={() => navigate({ to: "/preflop" })}
                >
                  <Dices />
                  <span>Preflop Trainer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="relative w-full">
          <SidebarTrigger className="absolute right-0.5 bottom-0.5" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
