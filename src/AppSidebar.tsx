import type { View } from "@/App";
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

interface Props {
  view: string;
  setView: (view: View) => void;
}

export const AppSidebar = (props: Props) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exercises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={props.view === "ranges"}
                  onClick={() => props.setView("ranges")}
                >
                  <Grid2X2Check />
                  <span>Draw Ranges</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={props.view === "preflop"}
                  onClick={() => props.setView("preflop")}
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
