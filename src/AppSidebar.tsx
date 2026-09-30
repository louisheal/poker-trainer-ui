import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { RANGE_TREE_ROOT, isRangeTreeNodeId } from "@/drawRanges/rangeTree";
import type { RangeTreeNode } from "@/drawRanges/rangeTree";
import { ChevronDown, ChevronRight, Grid2X2Check } from "lucide-react";
import { useState } from "react";

interface RangeTreeItemsProps {
  nodes: readonly RangeTreeNode[];
  depth: number;
  selectedNodeId: string;
  expandedNodeIds: ReadonlySet<string>;
  onSelect: (nodeId: string) => void;
  onToggle: (nodeId: string) => void;
}

const RangeTreeItems = ({
  nodes,
  depth,
  selectedNodeId,
  expandedNodeIds,
  onSelect,
  onToggle,
}: RangeTreeItemsProps) => (
  <>
    {nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = expandedNodeIds.has(node.id);

      return (
        <SidebarMenuItem key={node.id}>
          <div className="relative">
            <SidebarMenuButton
              isActive={selectedNodeId === node.id}
              size={depth === 0 ? "lg" : depth === 2 ? "sm" : "default"}
              className={hasChildren ? "pr-8" : undefined}
              onClick={() => onSelect(node.id)}
            >
              {depth === 0 && <Grid2X2Check />}
              <span>{node.label}</span>
            </SidebarMenuButton>
            {hasChildren && (
              <SidebarMenuAction
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.label}`}
                aria-expanded={isExpanded}
                onClick={() => onToggle(node.id)}
              >
                {isExpanded ? <ChevronDown /> : <ChevronRight />}
              </SidebarMenuAction>
            )}
          </div>
          {hasChildren && isExpanded && (
            <SidebarMenuSub>
              <RangeTreeItems
                nodes={node.children!}
                depth={depth + 1}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                onSelect={onSelect}
                onToggle={onToggle}
              />
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    })}
  </>
);

export const AppSidebar = () => {
  const navigate = useNavigate();
  const routeSearch = useRouterState({
    select: (state) => state.location.search as { tree?: unknown },
  });
  const selectedNodeId = isRangeTreeNodeId(routeSearch.tree)
    ? routeSearch.tree
    : RANGE_TREE_ROOT.id;
  const { setOpenMobile } = useSidebar();
  const [expandedNodeIds, setExpandedNodeIds] = useState<ReadonlySet<string>>(
    () =>
      new Set([
        "draw-ranges",
        "raise-first-in",
        "three-bet-call",
        "three-bet-bb",
      ]),
  );
  const closeMobileSidebar = () => setOpenMobile(false);
  const selectNode = (nodeId: string) => {
    void navigate({ to: "/ranges", search: { tree: nodeId } });
    closeMobileSidebar();
  };
  const toggleNode = (nodeId: string) => {
    setExpandedNodeIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exercises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <RangeTreeItems
                nodes={[RANGE_TREE_ROOT]}
                depth={0}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                onSelect={selectNode}
                onToggle={toggleNode}
              />
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
