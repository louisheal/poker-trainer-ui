import type { PokerPosition, SequenceAction } from "@/drawRanges/model";

export const POKER_POSITIONS: readonly PokerPosition[] = [
  "Lojack",
  "Hijack",
  "Cutoff",
  "Button",
  "Small Blind",
  "Big Blind",
];

export const RFI_POSITIONS: readonly PokerPosition[] = POKER_POSITIONS.filter(
  (position) => position !== "Big Blind",
);

export const getNextPosition = (sequenceLength: number) =>
  POKER_POSITIONS[sequenceLength];

export const toSpotKey = (sequence: readonly SequenceAction[]): string =>
  [
    "X",
    ...sequence.map(({ Position, Action }) => `${Position}_${Action}`),
  ].join("_");

export const createRfiSequence = (raiser: PokerPosition): SequenceAction[] => {
  const raiserIndex = RFI_POSITIONS.indexOf(raiser);
  if (raiserIndex < 0) {
    throw new Error(`${raiser} cannot open the pot`);
  }

  return RFI_POSITIONS.slice(0, raiserIndex).map((Position) => ({
    Position,
    Action: "Fold",
  }));
};
