import { PreflopTrainer } from "@/preflopTrainer/PreflopTrainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/preflop")({
  component: PreflopTrainer,
});
