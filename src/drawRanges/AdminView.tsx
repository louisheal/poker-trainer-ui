import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import { getRange, updateRange } from "@/drawRanges/api";
import {
  type PokerAction,
  type PokerPosition,
  type PokerRange,
  type RangeCell,
  type SequenceAction,
} from "@/drawRanges/model";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { useEffect, useState } from "react";

// TODO : this is duplicated code, move it to somewhere more sensible
const PokerPositions: PokerPosition[] = [
  "Lojack",
  "Hijack",
  "Cutoff",
  "Button",
  "Small Blind",
  "Big Blind",
];

// TODO : this is duplicated code, move it to somewhere more sensible
const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const getHandKey = (i: number, j: number) => {
  const cardA = cards[i];
  const cardB = cards[j];
  if (i < j) {
    return `${cardA}${cardB}s`;
  }
  if (i > j) {
    return `${cardB}${cardA}o`;
  }
  return `${cardA}${cardB}`;
};

const initialiseGrid = (): PokerRange => {
  const grid: RangeCell[][] = [];
  for (let i = 0; i < 13; i++) {
    const row: RangeCell[] = [];
    for (let j = 0; j < 13; j++) {
      row.push({ HandKey: getHandKey(i, j), Action: "Fold" });
    }
    grid.push(row);
  }
  return grid;
};

const toSpotKey = (sequence: SequenceAction[]): string => {
  const result: string[] = ["X"];
  sequence.forEach((action) =>
    result.push(`${action.Position}_${action.Action}`),
  );
  return result.join("_");
};

export const AdminView = () => {
  const [sequence, setSequence] = useState<SequenceAction[]>([]);
  const [range, setRange] = useState<PokerRange>(() => initialiseGrid());
  const nextPosition = PokerPositions[sequence.length];

  useEffect(() => {
    const loadRange = async () => {
      const spotKey = toSpotKey(sequence);
      const range = await getRange(spotKey);
      setRange(range);
    };
    loadRange();
  }, [sequence]);

  const onSubmit = async () => {
    const spotKey = toSpotKey(sequence);
    const newRange = await updateRange(spotKey, range);
    setRange(newRange);
  };

  const onSequenceUpdate = (position: PokerPosition, action: PokerAction) => {
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

  if (range === undefined) {
    return;
  }

  console.log(sequence);

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <ActionSequence sequence={sequence} onUpdate={onSequenceUpdate} />
      <RangeGrid grid={range} setGrid={setRange} />
      <Button onClick={onSubmit} variant="outline">
        Submit
      </Button>
    </div>
  );
};
