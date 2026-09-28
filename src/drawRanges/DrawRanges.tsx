import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import {
  createRfiSequence,
  RFI_POSITIONS,
  toSpotKey,
} from "@/drawRanges/actionSequence/spotSequence";
import { getRange } from "@/drawRanges/api";
import type { PokerRange, SequenceAction } from "@/drawRanges/model";
import { createFoldGrid } from "@/drawRanges/rangeGrid/handGrid";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const generateSequence = () => {
  const position =
    RFI_POSITIONS[Math.floor(Math.random() * RFI_POSITIONS.length)];
  return createRfiSequence(position);
};

export const DrawRanges = () => {
  const [sequence, setSequence] = useState<SequenceAction[]>([]);
  const [range, setRange] = useState<PokerRange>();
  const [grid, setGrid] = useState(() => createFoldGrid());
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
    setGrid(createFoldGrid());
    loadSpot();
  };

  useEffect(() => {
    loadSpot();
  }, []);

  if (range === undefined) {
    return (
      <div
        className="flex min-h-[50vh] w-full items-center justify-center"
        role="status"
        aria-label="Loading range"
      >
        <LoaderCircle
          className="size-8 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 px-0 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-8 md:py-8">
      <ActionSequence sequence={sequence} />
      {submitted ? (
        <>
          <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:flex-row lg:justify-center">
            <RangeGrid grid={grid} size="small" />
            <RangeGrid grid={range} size="small" />
          </div>
          <Button onClick={onNext} variant="outline">
            Next
          </Button>
        </>
      ) : (
        <>
          <RangeGrid grid={grid} setGrid={setGrid} drawable />
          <Button onClick={onSubmit} variant="outline">
            Submit
          </Button>
        </>
      )}
    </div>
  );
};
