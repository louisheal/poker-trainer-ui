import type {
  PokerAction,
  PokerPosition,
  SequenceAction,
} from "@/drawRanges/model";

export const POKER_POSITIONS: readonly PokerPosition[] = [
  "Lojack",
  "Hijack",
  "Cutoff",
  "Button",
  "Small Blind",
  "Big Blind",
];

const POSITION_SHORT_LABELS: Record<PokerPosition, string> = {
  Lojack: "LJ",
  Hijack: "HJ",
  Cutoff: "CO",
  Button: "BTN",
  "Small Blind": "SB",
  "Big Blind": "BB",
};

export const getPositionShortLabel = (position: PokerPosition) =>
  POSITION_SHORT_LABELS[position];

export const RFI_POSITIONS: readonly PokerPosition[] = POKER_POSITIONS.filter(
  (position) => position !== "Big Blind",
);

export const THREE_BET_RESPONSE_POSITIONS: readonly PokerPosition[] =
  POKER_POSITIONS.slice(1).reverse();

const UNOPENED_POT_ACTIONS: readonly PokerAction[] = ["Fold", "Raise"];
const FACING_RAISE_ACTIONS: readonly PokerAction[] = ["Fold", "Call", "Raise"];

export const getRangeActionsForSpot = (
  sequence: readonly SequenceAction[],
): readonly PokerAction[] =>
  sequence.some(({ Action }) => Action === "Raise")
    ? FACING_RAISE_ACTIONS
    : UNOPENED_POT_ACTIONS;

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

export const createThreeBetSequence = (
  opener: PokerPosition,
  responder: PokerPosition,
): SequenceAction[] => {
  if (!RFI_POSITIONS.includes(opener)) {
    throw new Error(`${opener} cannot open the pot`);
  }

  const responderIndex = POKER_POSITIONS.indexOf(responder);
  const openerIndex = POKER_POSITIONS.indexOf(opener);
  if (responderIndex <= openerIndex) {
    throw new Error(`${responder} cannot respond to an open from ${opener}`);
  }

  return POKER_POSITIONS.slice(0, responderIndex).map((Position) => ({
    Position,
    Action: Position === opener ? "Raise" : "Fold",
  }));
};

export const createBbThreeBetSequence = (opener: PokerPosition) =>
  createThreeBetSequence(opener, "Big Blind");

export type TrainingSpotMode = "open" | "bb-3bet";

export const createRandomTrainingSequence = (
  mode: TrainingSpotMode,
  random: () => number = Math.random,
): SequenceAction[] => {
  const opener = RFI_POSITIONS[Math.floor(random() * RFI_POSITIONS.length)];
  return mode === "open"
    ? createRfiSequence(opener)
    : createBbThreeBetSequence(opener);
};
