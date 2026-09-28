import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import {
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
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
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

  if (range === undefined) {
    return;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <ActionSequence sequence={sequence} onUpdate={onSequenceUpdate} />
      <RangeGrid grid={range} setGrid={setLoadedRange} drawable />
      <Button onClick={onSubmit} variant="outline">
        Submit
      </Button>
    </div>
  );
};
