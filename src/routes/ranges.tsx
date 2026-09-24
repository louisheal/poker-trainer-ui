import { DrawRanges } from "@/drawRanges/DrawRanges";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ranges")({
  component: DrawRanges,
});
