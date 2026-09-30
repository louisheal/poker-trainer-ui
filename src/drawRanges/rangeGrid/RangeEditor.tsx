import { Button } from "@/components/ui/button";
import type { PokerAction, PokerRange } from "@/drawRanges/model";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  grid: PokerRange;
  setGrid: (prev: PokerRange | ((prev: PokerRange) => PokerRange)) => void;
  availableActions: readonly PokerAction[];
  loading?: boolean;
  className?: string;
}

const actions: { action: PokerAction; swatch: string }[] = [
  { action: "Fold", swatch: "bg-blue-400" },
  { action: "Call", swatch: "bg-green-500" },
  { action: "Raise", swatch: "bg-red-500" },
];

export const RangeEditor = ({
  grid,
  setGrid,
  availableActions,
  loading = false,
  className,
}: Props) => {
  const [paintAction, setPaintAction] = useState<PokerAction>("Raise");
  const activePaintAction = availableActions.includes(paintAction)
    ? paintAction
    : (availableActions[0] ?? "Fold");
  const actionColumns =
    availableActions.length === 2 ? "grid-cols-2" : "grid-cols-3";

  useEffect(() => {
    if (!availableActions.includes(paintAction)) {
      setPaintAction(activePaintAction);
    }
  }, [activePaintAction, availableActions, paintAction]);

  return (
    <div
      className={`flex w-full flex-col items-center gap-3 ${className ?? ""}`}
    >
      <div
        className={`mx-2 grid w-[calc(100%-1rem)] max-w-2xl ${actionColumns} gap-2 sm:mx-0 sm:w-full`}
        role="group"
        aria-label="Action to paint"
      >
        {actions
          .filter(({ action }) => availableActions.includes(action))
          .map(({ action, swatch }) => (
            <Button
              key={action}
              type="button"
              variant={activePaintAction === action ? "secondary" : "outline"}
              aria-pressed={activePaintAction === action}
              onClick={() => setPaintAction(action)}
              className="h-10 min-w-0 gap-2 px-2 sm:px-3"
            >
              <span
                className={`size-3 shrink-0 rounded-full ${swatch}`}
                aria-hidden="true"
              />
              <span className="truncate">{action}</span>
            </Button>
          ))}
      </div>
      {loading ? (
        <div
          className="flex aspect-square w-full max-w-2xl items-center justify-center"
          role="status"
          aria-label="Loading range"
        >
          <LoaderCircle
            className="size-8 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : (
        <RangeGrid
          grid={grid}
          setGrid={setGrid}
          paintAction={activePaintAction}
        />
      )}
    </div>
  );
};
