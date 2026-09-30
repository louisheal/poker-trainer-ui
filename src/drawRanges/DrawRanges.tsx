import { Button } from "@/components/ui/button";
import { ActionSequence } from "@/drawRanges/actionSequence/ActionSequence";
import {
  getRangeActionsForSpot,
  toSpotKey,
} from "@/drawRanges/actionSequence/spotSequence";
import { getRange, RangeNotFoundError } from "@/drawRanges/api";
import type { PokerRange, SequenceAction } from "@/drawRanges/model";
import {
  createRandomSequenceForTreeNode,
  findRangeTreeNode,
} from "@/drawRanges/rangeTree";
import { createFoldGrid } from "@/drawRanges/rangeGrid/handGrid";
import { RangeEditor } from "@/drawRanges/rangeGrid/RangeEditor";
import { RangeGrid } from "@/drawRanges/rangeGrid/RangeGrid";
import { useEffect, useState } from "react";

interface Props {
  treeNodeId: string;
}

export const DrawRanges = ({ treeNodeId }: Props) => {
  const isSelectedLeaf = Boolean(findRangeTreeNode(treeNodeId)?.sequence);
  const [sequence, setSequence] = useState<SequenceAction[]>(() =>
    createRandomSequenceForTreeNode(treeNodeId),
  );
  const [range, setRange] = useState<PokerRange>();
  const [grid, setGrid] = useState(() => createFoldGrid());
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState<string>();

  const onSubmit = () => {
    setSubmitted(true);
  };

  const onNext = () => {
    setRange(undefined);
    setSubmitted(false);
    setGrid(createFoldGrid());
    setLoadError(undefined);
    setSequence(createRandomSequenceForTreeNode(treeNodeId));
  };

  useEffect(() => {
    let isCurrentSpot = true;
    setRange(undefined);
    setLoadError(undefined);

    const loadRange = async () => {
      const spotKey = toSpotKey(sequence);
      try {
        const loadedRange = await getRange(spotKey);
        if (isCurrentSpot) {
          setRange(loadedRange);
        }
      } catch (error) {
        if (!isCurrentSpot) {
          return;
        }
        setLoadError(
          error instanceof RangeNotFoundError
            ? "This spot's range has not been set up yet."
            : "Could not load this range.",
        );
      }
    };

    void loadRange();
    return () => {
      isCurrentSpot = false;
    };
  }, [sequence]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 px-0 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-8 md:py-8">
      {!isSelectedLeaf && <ActionSequence sequence={sequence} />}
      {loadError ? (
        <div className="flex flex-col items-center gap-3" role="alert">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button onClick={onNext} variant="outline">
            Next spot
          </Button>
        </div>
      ) : (
        <>
          <RangeEditor
            grid={grid}
            setGrid={setGrid}
            availableActions={getRangeActionsForSpot(sequence)}
            loading={range === undefined}
            className={submitted ? "hidden" : undefined}
          />
          {submitted && range !== undefined && (
            <>
              <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:flex-row lg:justify-center">
                <RangeGrid grid={grid} size="small" />
                <RangeGrid grid={range} size="small" />
              </div>
              <Button onClick={onNext} variant="outline">
                Next
              </Button>
            </>
          )}
          {!submitted && range !== undefined && (
            <Button onClick={onSubmit} variant="outline">
              Submit
            </Button>
          )}
        </>
      )}
    </div>
  );
};
