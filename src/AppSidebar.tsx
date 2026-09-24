import { Link, useMatchRoute } from "@tanstack/react-router";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Dices, Grid2X2Check } from "lucide-react";

export const AppSidebar = () => {
  const matchRoute = useMatchRoute();
  const { setOpenMobile } = useSidebar();
  const isRangesActive = Boolean(matchRoute({ to: "/ranges", fuzzy: true }));
  const isPreflopActive = Boolean(matchRoute({ to: "/preflop", fuzzy: true }));
  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exercises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/ranges" />}
                  isActive={isRangesActive}
                  size="lg"
                  onClick={closeMobileSidebar}
                >
                  <Grid2X2Check />
                  <span>Draw Ranges</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/preflop" />}
                  isActive={isPreflopActive}
                  size="lg"
                  onClick={closeMobileSidebar}
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
          <SidebarTrigger className="absolute right-0.5 bottom-0.5 hidden md:inline-flex" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
