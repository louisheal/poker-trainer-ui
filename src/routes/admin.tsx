import { AdminGate } from "@/drawRanges/AdminGate";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});
