import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import {
  getRangeActionsForSpot,
  getNextPosition,
  toSpotKey,
} from "@/drawRanges/actionSequence/spotSequence";
import {
  getAdminRange,
  RangeNotFoundError,
  updateAdminRange,
} from "@/drawRanges/adminApi";
import {
  type PokerAction,
  type PokerPosition,
  type PokerRange,
  type SequenceAction,
} from "@/drawRanges/model";
import { createFoldGrid } from "@/drawRanges/rangeGrid/handGrid";
import { RangeEditor } from "@/drawRanges/rangeGrid/RangeEditor";
import { useEffect, useState } from "react";

export const AdminView = () => {
  const [sequence, setSequence] = useState<SequenceAction[]>([]);
  const [range, setRange] = useState<PokerRange>();
  const nextPosition = getNextPosition(sequence.length);

  useEffect(() => {
    let isCurrentSpot = true;

    const loadRange = async () => {
      const spotKey = toSpotKey(sequence);
      try {
        const range = await getAdminRange(spotKey);
        if (isCurrentSpot) {
          setRange(range);
        }
      } catch (error) {
        if (!isCurrentSpot) {
          return;
        }
        setRange(
          error instanceof RangeNotFoundError ? createFoldGrid() : undefined,
        );
      }
    };

    void loadRange();
    return () => {
      isCurrentSpot = false;
    };
  }, [sequence]);

  const onSubmit = async () => {
    if (range === undefined) {
      return;
    }

    const spotKey = toSpotKey(sequence);
    const newRange = await updateAdminRange(spotKey, range);
    setRange(newRange);
  };

  const onSequenceUpdate = (position: PokerPosition, action: PokerAction) => {
    setRange(undefined);
    setSequence((prev) => {
      const next: SequenceAction[] = [];

      for (let i = 0; i < prev.length; i++) {
        if (prev[i].Position === position) {
          next.push({ ...prev[i], Action: action });
          break;
        }
        next.push(prev[i]);
      }
      if (nextPosition === position) {
        next.push({ Position: position, Action: action });
      }
      return next;
    });
  };

  const setLoadedRange = (
    next: PokerRange | ((previous: PokerRange) => PokerRange),
  ) => {
    setRange((previous) => {
      if (previous === undefined) {
        return previous;
      }
      return typeof next === "function" ? next(previous) : next;
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 px-0 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-8 md:py-8">
      <ActionSequence sequence={sequence} onUpdate={onSequenceUpdate} />
      <RangeEditor
        grid={range ?? createFoldGrid()}
        setGrid={setLoadedRange}
        availableActions={getRangeActionsForSpot(sequence)}
        loading={range === undefined}
      />
      {range !== undefined && (
        <>
          <Button onClick={onSubmit} variant="outline">
            Submit
          </Button>
        </>
      )}
    </div>
  );
};
