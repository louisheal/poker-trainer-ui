import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import { getSpot } from "@/drawRanges/api";
import type { RangeCell, RangeSpot } from "@/drawRanges/model";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { useEffect, useState } from "react";

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

export const DrawRanges = () => {
  const [spot, setSpot] = useState<RangeSpot>();
  const [grid, setGrid] = useState(() => initialiseGrid());
  const [submitted, setSubmitted] = useState(false);

  const loadSpot = async () => {
    const spot = await getSpot();
    setSpot(spot);
  };

  const onSubmit = () => {
    setSubmitted(true);
  };

  const onNext = () => {
    setSpot(undefined);
    setSubmitted(false);
    setGrid(initialiseGrid());
    loadSpot();
  };

  useEffect(() => {
    loadSpot();
  }, []);

  // TODO : add loading spinner
  if (spot === undefined) {
    return;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <ActionSequence sequence={spot.Sequence} />
      {submitted ? (
        <>
          <div className="flex gap-4">
            <RangeGrid grid={grid} setGrid={() => {}} size="small" />
            <RangeGrid grid={spot.Range} setGrid={() => {}} size="small" />
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
