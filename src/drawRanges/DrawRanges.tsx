import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import { getRange } from "@/drawRanges/api";
import {
  type PokerPosition,
  type PokerRange,
  type RangeCell,
  type SequenceAction,
} from "@/drawRanges/model";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { useEffect, useState } from "react";

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

const initialiseGrid = () => {
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

const generateSequence = () => {
  const position = Math.floor(Math.random() * 4);
  const result: SequenceAction[] = [];
  for (let i = 0; i < position; i++) {
    result.push({ Position: PokerPositions[i], Action: "Fold" });
  }
  return result;
};

export const DrawRanges = () => {
  const [sequence, setSequence] = useState<SequenceAction[]>([]);
  const [range, setRange] = useState<PokerRange>();
  const [grid, setGrid] = useState(() => initialiseGrid());
  const [submitted, setSubmitted] = useState(false);

  const loadSpot = async () => {
    const sequence: SequenceAction[] = generateSequence();
    setSequence(sequence);

    const spotKey = toSpotKey(sequence);
    const range = await getRange(spotKey);
    setRange(range);
  };

  const onSubmit = () => {
    setSubmitted(true);
  };

  const onNext = () => {
    setRange(undefined);
    setSubmitted(false);
    setGrid(initialiseGrid());
    loadSpot();
  };

  useEffect(() => {
    loadSpot();
  }, []);

  // TODO : add loading spinner
  if (range === undefined) {
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-3 sm:gap-4 sm:p-4 md:p-8">
      <ActionSequence sequence={sequence} />
      {submitted ? (
        <>
          <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:flex-row lg:justify-center">
            <RangeGrid grid={grid} setGrid={() => {}} size="small" />
            <RangeGrid grid={range} setGrid={() => {}} size="small" />
          </div>
          <Button onClick={onNext} variant="outline">
            Next
          </Button>
        </>
      ) : (
        <>
          <RangeGrid grid={grid} setGrid={setGrid} />
          <Button onClick={onSubmit} variant="outline">
            Submit
          </Button>
        </>
      )}
    </div>
  );
};
