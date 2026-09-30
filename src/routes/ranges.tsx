import { DrawRanges } from "@/drawRanges/DrawRanges";
import { isRangeTreeNodeId, RANGE_TREE_ROOT } from "@/drawRanges/rangeTree";
import { createFileRoute, useSearch } from "@tanstack/react-router";

const DrawRangesRoute = () => {
  const { tree } = useSearch({ from: "/ranges" });
  return <DrawRanges key={tree} treeNodeId={tree} />;
};

export const Route = createFileRoute("/ranges")({
  validateSearch: (search: Record<string, unknown>) => ({
    tree: isRangeTreeNodeId(search.tree) ? search.tree : RANGE_TREE_ROOT.id,
  }),
  component: DrawRangesRoute,
});
